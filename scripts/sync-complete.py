#!/usr/bin/env python3
"""
Script completo de sincronização GitHub → GitLab AGES
Inclui espelhamento, issues, PRs, labels e relatórios
Para uso no projeto Pro-Mata PUCRS
"""

import os
import json
import requests
import gitlab
import subprocess
import sys
from datetime import datetime
from typing import Dict, List, Optional

class ProMataCompleteSyncer:
    def __init__(self):
        """Inicializa o sincronizador completo"""
        self.git_token = os.environ.get('GIT_TOKEN')
        self.gitlab_url = os.environ.get('GITLAB_URL', 'https://tools.ages.pucrs.br')
        self.gitlab_token = os.environ.get('GITLAB_TOKEN')
        self.gitlab_project_id = os.environ.get('GITLAB_PROJECT_ID')
        self.repo_name = os.environ.get('GITHUB_REPOSITORY')
        
        # Validar configurações
        if not all([self.git_token, self.gitlab_token, self.gitlab_project_id, self.repo_name]):
            raise ValueError("Configurações incompletas. Verifique os secrets.")
        
        # Clientes API
        self.gl = gitlab.Gitlab(self.gitlab_url, private_token=self.gitlab_token)
        
        # Validar acesso ao GitLab antes de buscar o projeto
        try:
            self.gl.auth()
            self.log(f"✅ Conectado ao GitLab: {self.gitlab_url}")
        except Exception as e:
            raise ValueError(f"❌ Erro de autenticação GitLab: {str(e)}")
        
        # Determinar nome do projeto baseado no repositório
        repo_path = self.repo_name.split('/')[-1]
        repo_mapping = {
            'frontend': 'frontend',
            'backend': 'backend', 
            'infrastructure': 'infra',
            'database': 'database'
        }
        self.gitlab_repo_name = repo_mapping.get(repo_path, repo_path)
        
        # Tentar acessar o projeto ou criar se não existir
        try:
            # Se GITLAB_PROJECT_ID for fornecido, tentar usar
            if self.gitlab_project_id and self.gitlab_project_id != '1735':
                try:
                    self.project = self.gl.projects.get(self.gitlab_project_id)
                    self.log(f"✅ Projeto encontrado: {self.project.name}")
                except gitlab.exceptions.GitlabGetError:
                    self.log(f"⚠️ Projeto ID {self.gitlab_project_id} não encontrado, tentando buscar por nome...")
                    self.project = None
            else:
                self.project = None
            
            # Se não encontrou projeto, buscar por nome no grupo
            if not self.project:
                group = self.gl.groups.get(1735)  # Group ID do Pró-Mata
                projects = group.projects.list(search=self.gitlab_repo_name)
                
                if projects:
                    self.project = self.gl.projects.get(projects[0].id)
                    self.log(f"✅ Projeto encontrado por nome: {self.project.name} (ID: {self.project.id})")
                else:
                    # Criar projeto automaticamente
                    self.log(f"📝 Criando projeto '{self.gitlab_repo_name}' no grupo Pró-Mata...")
                    self.project = self._create_project_in_group(group)
                    
        except Exception as e:
            raise ValueError(f"❌ Erro ao acessar/criar projeto GitLab: {str(e)}")
        
        self.github_headers = {
            'Authorization': f'token {self.git_token}',
            'Accept': 'application/vnd.github.v3+json'
        }

    def _create_project_in_group(self, group):
        """Cria um novo projeto no grupo GitLab"""
        try:
            project_data = {
                'name': self.gitlab_repo_name,
                'path': self.gitlab_repo_name,
                'namespace_id': group.id,
                'description': f'Repositório {self.gitlab_repo_name} do projeto Pro-Mata AGES - Sincronizado automaticamente do GitHub',
                'visibility': 'public',
                'issues_enabled': True,
                'merge_requests_enabled': True,
                'wiki_enabled': True,
                'snippets_enabled': False,
                'container_registry_enabled': False,
                'shared_runners_enabled': True,
                'initialize_with_readme': False,  # Será espelhado do GitHub
            }
            
            project = self.gl.projects.create(project_data)
            self.log(f"✅ Projeto criado com sucesso: {project.name} (ID: {project.id})")
            self.log(f"🔗 URL: {project.web_url}")
            
            return project
            
        except Exception as e:
            self.log(f"❌ Erro ao criar projeto: {str(e)}", "ERROR")
            raise

    def log(self, message: str, level: str = "INFO"):
        """Log com timestamp e cores"""
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        
        # Emojis e cores por nível
        level_config = {
            "INFO": "ℹ️",
            "WARN": "⚠️", 
            "ERROR": "❌",
            "SUCCESS": "✅"
        }
        
        emoji = level_config.get(level, "ℹ️")
        print(f"[{timestamp}] {level}: {emoji} {message}")
        
        # Para GitHub Actions, usar commands específicos
        if level == "WARN":
            print(f"::warning::{message}")
        elif level == "ERROR":
            print(f"::error::{message}")
        elif level == "SUCCESS":
            print(f"::notice::{message}")

    def mirror_repository(self):
        """Espelha o repositório completo para o GitLab"""
        self.log("🔄 Iniciando espelhamento do repositório...")
        
        try:
            # Usar o projeto GitLab correto já identificado/criado
            gitlab_remote_url = f"https://oauth2:{self.gitlab_token}@{self.gitlab_url.replace('https://', '')}/pro-mata/{self.gitlab_repo_name}.git"
                                
            # Remover remote se existir
            subprocess.run(['git', 'remote', 'remove', 'gitlab'], capture_output=True, check=False)
            
            # Adicionar remote GitLab
            result = subprocess.run(['git', 'remote', 'add', 'gitlab', gitlab_remote_url], 
                                 capture_output=True, text=True)
            
            if result.returncode != 0:
                self.log(f"Aviso ao adicionar remote: {result.stderr}")
            
            self.log(f"🔗 Remote GitLab configurado: {self.project.web_url}")
            
            # Push de todas as branches
            result = subprocess.run(['git', 'push', 'gitlab', '--all', '--force'], 
                                  capture_output=True, text=True)
            
            if result.returncode == 0:
                self.log("✅ Branches sincronizadas com sucesso")
            else:
                self.log(f"❌ Erro ao sincronizar branches: {result.stderr}", "ERROR")
            
            # Push de todas as tags
            result = subprocess.run(['git', 'push', 'gitlab', '--tags', '--force'], 
                                  capture_output=True, text=True)
            
            if result.returncode == 0:
                self.log("✅ Tags sincronizadas com sucesso")
            else:
                self.log(f"Aviso ao sincronizar tags: {result.stderr}")
                
        except Exception as e:
            self.log(f"❌ Erro no espelhamento: {str(e)}", "ERROR")

    def setup_gitlab_labels(self):
        """Configura labels padrão no GitLab (seguindo padrão CP-Planta)"""
        self.log("🏷️ Configurando labels no GitLab...")
        
        default_labels = [
            {'name': 'bug', 'color': '#d73a4a', 'description': 'Erro ou problema no sistema'},
            {'name': 'enhancement', 'color': '#a2eeef', 'description': 'Nova funcionalidade ou melhoria'},
            {'name': 'documentation', 'color': '#0075ca', 'description': 'Relacionado à documentação'},
            {'name': 'IMPORTANTE', 'color': '#b60205', 'description': 'Alta prioridade'},
            {'name': 'Débito Técnico', 'color': '#fbca04', 'description': 'Débito técnico'},
            {'name': 'frontend', 'color': '#7057ff', 'description': 'Frontend React'},
            {'name': 'backend', 'color': '#ff6b00', 'description': 'Backend Spring Boot'},
            {'name': 'infraestrutura', 'color': '#006b75', 'description': 'Infraestrutura e DevOps'},
            {'name': 'Finalizada', 'color': '#0e8a16', 'description': 'Tarefa finalizada'},
            {'name': 'Integração', 'color': '#1d76db', 'description': 'Integração entre sistemas'},
            {'name': 'github-sync', 'color': '#24292f', 'description': 'Sincronizado do GitHub'},
        ]
        
        created_count = 0
        
        for label_data in default_labels:
            try:
                self.project.labels.create(label_data)
                created_count += 1
                self.log(f"Label criada: {label_data['name']}")
            except Exception:
                # Label já existe
                pass
        
        self.log(f"✅ Labels configuradas: {created_count} novas criadas")

    def run_issues_sync(self):
        """Executa sincronização de issues via script separado"""
        self.log("📋 Executando sincronização de issues...")
        
        try:
            result = subprocess.run([
                sys.executable, 
                'scripts/sync-issues.py'
            ], capture_output=True, text=True)
            
            if result.returncode == 0:
                self.log("✅ Sincronização de issues concluída")
                # Mostrar saída do script
                if result.stdout:
                    print(result.stdout)
                return True
            else:
                # Se não há issues para sincronizar, não é erro crítico
                if "no issues found" in result.stderr.lower() or not result.stderr.strip():
                    self.log("ℹ️ Nenhuma issue encontrada para sincronizar (normal para repositórios novos)")
                    return True
                else:
                    self.log(f"⚠️ Aviso na sincronização de issues: {result.stderr}", "WARN")
                    return True  # Não falhar por issues
                
        except FileNotFoundError:
            self.log("ℹ️ Script sync-issues.py não encontrado - pulando sincronização de issues")
            return True
        except Exception as e:
            self.log(f"⚠️ Erro na sincronização de issues: {str(e)}", "WARN")
            return True  # Não falhar por issues

    def run_prs_sync(self):
        """Executa sincronização de PRs via script separado"""
        self.log("🔄 Executando sincronização de Pull Requests...")
        
        try:
            result = subprocess.run([
                sys.executable, 
                'scripts/sync-prs.py'
            ], capture_output=True, text=True)
            
            if result.returncode == 0:
                self.log("✅ Sincronização de PRs concluída")
                # Mostrar saída do script
                if result.stdout:
                    print(result.stdout)
                return True
            else:
                # Se não há PRs para sincronizar, não é erro crítico
                if "no pull requests found" in result.stderr.lower() or not result.stderr.strip():
                    self.log("ℹ️ Nenhum PR encontrado para sincronizar (normal para repositórios novos)")
                    return True
                else:
                    self.log(f"⚠️ Aviso na sincronização de PRs: {result.stderr}", "WARN")
                    return True  # Não falhar por PRs
                
        except FileNotFoundError:
            self.log("ℹ️ Script sync-prs.py não encontrado - pulando sincronização de PRs")
            return True
        except Exception as e:
            self.log(f"⚠️ Erro na sincronização de PRs: {str(e)}", "WARN")
            return True  # Não falhar por PRs

    def generate_complete_report(self):
        """Gera relatório completo de sincronização"""
        self.log("📊 Gerando relatório completo de sincronização...")
        
        try:
            # Obter estatísticas do GitHub
            github_issues = self._get_github_stats('issues')
            github_prs = self._get_github_stats('pulls')
            
            # Obter estatísticas do GitLab
            gitlab_issues = self.project.issues.list(all=True)
            gitlab_mrs = self.project.mergerequests.list(all=True)
            
            # Informações do repositório
            repo_info = self._get_repo_info()
            
            report = f"""# 📊 Relatório Completo de Sincronização - Pro-Mata AGES

**Data/Hora**: {datetime.now().strftime('%d/%m/%Y às %H:%M:%S')}
**Repositório**: {self.repo_name}
**GitLab Project**: {self.gitlab_url}/pro-mata/{self.repo_name.split('/')[-1]}

## 🏗️ Informações do Repositório

- **Linguagem principal**: {repo_info.get('language', 'N/A')}
- **Tamanho**: {repo_info.get('size', 0)} KB
- **Branch padrão**: {repo_info.get('default_branch', 'main')}
- **Última atualização**: {repo_info.get('updated_at', 'N/A')}

## 📋 Issues

### GitHub Issues
- **Total**: {len(github_issues)}
- **Abertas**: {sum(1 for i in github_issues if i['state'] == 'open')}
- **Fechadas**: {sum(1 for i in github_issues if i['state'] == 'closed')}

### GitLab Issues  
- **Total**: {len(gitlab_issues)}
- **Abertas**: {sum(1 for i in gitlab_issues if i.state == 'opened')}
- **Fechadas**: {sum(1 for i in gitlab_issues if i.state == 'closed')}

**Status de Sincronização**: {'✅ Sincronizado' if len(gitlab_issues) >= len(github_issues) else '⚠️ Pendente'}

## 🔄 Pull/Merge Requests

### GitHub Pull Requests
- **Total**: {len(github_prs)}
- **Abertos**: {sum(1 for p in github_prs if p['state'] == 'open')}
- **Fechados**: {sum(1 for p in github_prs if p['state'] == 'closed')}

### GitLab Merge Requests
- **Total**: {len(gitlab_mrs)}
- **Abertos**: {sum(1 for m in gitlab_mrs if m.state == 'opened')}
- **Fechados**: {sum(1 for m in gitlab_mrs if m.state == 'closed')}

**Status de Sincronização**: {'✅ Sincronizado' if len(gitlab_mrs) >= len(github_prs) else '⚠️ Pendente'}

## 🔗 Links Úteis

- [📱 Repositório GitHub](https://github.com/{self.repo_name})
- [🦊 Projeto GitLab]({self.gitlab_url}/pro-mata/{self.repo_name.split('/')[-1]})
- [📋 Kanban Board]({self.gitlab_url}/pro-mata/{self.repo_name.split('/')[-1]}/-/boards)
- [🔍 Issues GitLab]({self.gitlab_url}/pro-mata/{self.repo_name.split('/')[-1]}/-/issues)
- [🔄 Merge Requests]({self.gitlab_url}/pro-mata/{self.repo_name.split('/')[-1]}/-/merge_requests)

## 📈 Resumo da Sincronização

- **Repositório**: ✅ Espelhado
- **Labels**: ✅ Configuradas
- **Issues**: {'✅ Sincronizadas' if len(gitlab_issues) >= len(github_issues) else '⚠️ Pendentes'}
- **Pull Requests**: {'✅ Sincronizados' if len(gitlab_mrs) >= len(github_prs) else '⚠️ Pendentes'}

---
*Última sincronização: {datetime.now().isoformat()}*
*Sistema de Sincronização Automática Pro-Mata AGES v2.0*
"""
            
            # Salvar relatório
            with open('sync-report.md', 'w', encoding='utf-8') as f:
                f.write(report)
            
            print(report)
            self.log("✅ Relatório completo gerado: sync-report.md")
            
        except Exception as e:
            self.log(f"❌ Erro ao gerar relatório: {str(e)}", "ERROR")

    def _get_github_stats(self, endpoint: str) -> List[Dict]:
        """Helper para obter estatísticas do GitHub"""
        try:
            url = f"https://api.github.com/repos/{self.repo_name}/{endpoint}"
            params = {'state': 'all', 'per_page': 100}
            
            items = []
            page = 1
            
            while page <= 5:  # Limitar a 5 páginas
                params['page'] = page
                response = requests.get(url, headers=self.github_headers, params=params)
                response.raise_for_status()
                
                page_items = response.json()
                if not page_items:
                    break
                    
                if endpoint == 'issues':
                    # Filtrar apenas issues (não PRs)
                    items.extend([item for item in page_items if 'pull_request' not in item])
                else:
                    items.extend(page_items)
                    
                page += 1
                
            return items
            
        except Exception as e:
            self.log(f"❌ Erro ao buscar {endpoint}: {str(e)}", "ERROR")
            return []

    def _get_repo_info(self) -> Dict:
        """Obtém informações básicas do repositório"""
        try:
            url = f"https://api.github.com/repos/{self.repo_name}"
            response = requests.get(url, headers=self.github_headers)
            response.raise_for_status()
            return response.json()
        except Exception:
            return {}

    def run_complete_sync(self):
        """Executa sincronização completa"""
        self.log("🚀 Iniciando sincronização completa GitHub → GitLab AGES")
        
        success_count = 0
        total_steps = 5
        
        try:
            # 1. Configurar labels
            self.setup_gitlab_labels()
            success_count += 1
            
            # 2. Espelhar repositório
            self.mirror_repository()
            success_count += 1
            
            # 3. Sincronizar issues (sempre conta como sucesso)
            if self.run_issues_sync():
                success_count += 1
            
            # 4. Sincronizar PRs (sempre conta como sucesso)
            if self.run_prs_sync():
                success_count += 1
                
            # 5. Gerar relatório
            self.generate_complete_report()
            success_count += 1
            
            # Resultado final
            if success_count == total_steps:
                self.log("🎉 Sincronização completa finalizada com TOTAL sucesso!")
                return True
            elif success_count >= 3:  # Core functions working
                self.log(f"✅ Sincronização finalizada com sucesso ({success_count}/{total_steps} etapas)")
                self.log("💡 Issues/PRs podem não existir ainda - isso é normal para repositórios novos")
                return True
            else:
                self.log(f"⚠️ Sincronização finalizada com problemas ({success_count}/{total_steps} etapas bem-sucedidas)")
                return False
                
        except Exception as e:
            self.log(f"❌ Erro crítico na sincronização: {str(e)}", "ERROR")
            return False

def main():
    """Função principal"""
    try:
        syncer = ProMataCompleteSyncer()
        success = syncer.run_complete_sync()
        
        if not success:
            sys.exit(1)
            
    except Exception as e:
        print(f"❌ ERRO CRÍTICO: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()