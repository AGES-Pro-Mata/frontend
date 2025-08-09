#!/usr/bin/env python3
"""
Script específico para sincronização de Issues GitHub → GitLab AGES
Para uso no projeto Pro-Mata PUCRS
"""

import os
import json
import requests
import gitlab
from datetime import datetime
from typing import Dict, List, Optional

class GitHubIssuesSyncer:
    def __init__(self):
        """Inicializa o sincronizador de issues"""
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
        self.project = self.gl.projects.get(self.gitlab_project_id)
        
        self.github_headers = {
            'Authorization': f'token {self.git_token}',
            'Accept': 'application/vnd.github.v3+json'
        }

    def log(self, message: str, level: str = "INFO"):
        """Log com timestamp"""
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        print(f"[{timestamp}] {level}: {message}")

    def get_github_issues(self) -> List[Dict]:
        """Busca issues do GitHub"""
        try:
            url = f"https://api.github.com/repos/{self.repo_name}/issues"
            params = {'state': 'all', 'per_page': 100}
            
            issues = []
            page = 1
            
            while True:
                params['page'] = page
                response = requests.get(url, headers=self.github_headers, params=params)
                response.raise_for_status()
                
                page_issues = response.json()
                if not page_issues:
                    break
                    
                # Filtrar apenas issues (não PRs)
                issues.extend([issue for issue in page_issues if 'pull_request' not in issue])
                page += 1
                
                if page > 10:  # Limitar para evitar loops infinitos
                    break
                
            self.log(f"Encontradas {len(issues)} issues no GitHub")
            return issues
            
        except Exception as e:
            self.log(f"❌ Erro ao buscar issues do GitHub: {str(e)}", "ERROR")
            return []

    def get_gitlab_issues(self) -> List:
        """Busca issues do GitLab"""
        try:
            issues = self.project.issues.list(all=True)
            self.log(f"Encontradas {len(issues)} issues no GitLab")
            return issues
        except Exception as e:
            self.log(f"❌ Erro ao buscar issues do GitLab: {str(e)}", "ERROR")
            return []

    def create_gitlab_issue(self, github_issue: Dict) -> Optional[object]:
        """Cria issue no GitLab baseada na issue do GitHub"""
        try:
            # Manter título original
            title = github_issue['title']
            
            # Criar descrição preservando conteúdo original
            original_body = github_issue.get('body', '') or ''
            
            description = f"""{original_body}

---
## 📋 Sincronizado do GitHub

- 🔗 **Issue original**: {github_issue['html_url']}
- 👤 **Autor**: @{github_issue['user']['login']} 
- 📅 **Criado**: {github_issue['created_at']}
- 🔢 **ID GitHub**: #{github_issue['number']}
- 🏷️ **Estado**: {github_issue['state']}

*Sincronizado automaticamente do GitHub para GitLab AGES*
"""

            # Processar labels - manter originais + adicionar github-sync
            labels = []
            for label in github_issue.get('labels', []):
                labels.append(label['name'])
            
            # Adicionar label de identificação
            labels.append('github-sync')
            
            # Mapear estado para GitLab
            state_event = 'close' if github_issue['state'] == 'closed' else None
            
            # Dados da issue para GitLab
            issue_data = {
                'title': title,
                'description': description,
                'labels': ','.join(labels) if labels else None,
            }
            
            # Aplicar estado se necessário
            if state_event:
                issue_data['state_event'] = state_event
            
            # Criar issue no GitLab
            gitlab_issue = self.project.issues.create(issue_data)
            
            self.log(f"✅ Issue criada: #{gitlab_issue.iid} - {title[:50]}...")
            return gitlab_issue
            
        except Exception as e:
            self.log(f"❌ Erro ao criar issue GitLab: {str(e)}", "ERROR")
            return None

    def update_gitlab_issue(self, gitlab_issue, github_issue: Dict):
        """Atualiza issue existente no GitLab se necessário"""
        try:
            # Verificar se precisa atualizar estado
            github_state = github_issue['state']
            gitlab_state = gitlab_issue.state
            
            # Mapear estados GitHub → GitLab
            should_be_closed = github_state == 'closed'
            is_closed = gitlab_state == 'closed'
            
            if should_be_closed and not is_closed:
                gitlab_issue.state_event = 'close'
                gitlab_issue.save()
                self.log(f"✅ Issue #{gitlab_issue.iid} fechada para sincronizar com GitHub")
            elif not should_be_closed and is_closed:
                gitlab_issue.state_event = 'reopen'
                gitlab_issue.save()
                self.log(f"✅ Issue #{gitlab_issue.iid} reaberta para sincronizar com GitHub")
                
        except Exception as e:
            self.log(f"❌ Erro ao atualizar issue: {str(e)}", "ERROR")

    def save_issue_mapping(self, github_id: int, gitlab_iid: int):
        """Salva mapeamento entre issues GitHub e GitLab"""
        mapping_file = '.github/data/issue-mapping.json'
        
        try:
            # Criar diretório se não existir
            os.makedirs('.github/data', exist_ok=True)
            
            # Carregar mapeamentos existentes
            if os.path.exists(mapping_file):
                with open(mapping_file, 'r') as f:
                    mappings = json.load(f)
            else:
                mappings = {}
            
            # Adicionar novo mapeamento
            mappings[str(github_id)] = gitlab_iid
            
            # Salvar arquivo atualizado
            with open(mapping_file, 'w') as f:
                json.dump(mappings, f, indent=2)
                
        except Exception as e:
            self.log(f"❌ Erro ao salvar mapeamento: {str(e)}", "ERROR")

    def load_issue_mapping(self) -> Dict[str, int]:
        """Carrega mapeamento existente entre issues"""
        mapping_file = '.github/data/issue-mapping.json'
        
        try:
            if os.path.exists(mapping_file):
                with open(mapping_file, 'r') as f:
                    return json.load(f)
        except Exception as e:
            self.log(f"⚠️ Erro ao carregar mapeamentos: {str(e)}", "WARN")
        
        return {}

    def sync_issues(self):
        """Função principal de sincronização de issues"""
        self.log("🔄 Iniciando sincronização de issues GitHub → GitLab...")
        
        # Buscar issues de ambas as plataformas
        github_issues = self.get_github_issues()
        gitlab_issues = self.get_gitlab_issues()
        
        # Carregar mapeamentos existentes
        existing_mappings = self.load_issue_mapping()
        
        # Criar índices para busca rápida
        gitlab_titles = {issue.title: issue for issue in gitlab_issues}
        gitlab_by_iid = {issue.iid: issue for issue in gitlab_issues}
        
        created_count = 0
        updated_count = 0
        skipped_count = 0
        
        for github_issue in github_issues:
            github_id = str(github_issue['number'])
            original_title = github_issue['title']
            
            # Verificar se já existe mapeamento
            if github_id in existing_mappings:
                gitlab_iid = existing_mappings[github_id]
                if gitlab_iid in gitlab_by_iid:
                    # Issue já mapeada, verificar se precisa atualizar
                    self.update_gitlab_issue(gitlab_by_iid[gitlab_iid], github_issue)
                    updated_count += 1
                    continue
            
            # Verificar se já existe pelo título
            if original_title in gitlab_titles:
                # Issue existe mas não está mapeada, criar mapeamento
                gitlab_issue = gitlab_titles[original_title]
                self.save_issue_mapping(github_issue['number'], gitlab_issue.iid)
                self.update_gitlab_issue(gitlab_issue, github_issue)
                updated_count += 1
                continue
            
            # Issue não existe, criar nova
            gitlab_issue = self.create_gitlab_issue(github_issue)
            if gitlab_issue:
                self.save_issue_mapping(github_issue['number'], gitlab_issue.iid)
                created_count += 1
            else:
                skipped_count += 1
        
        # Relatório final
        total_processed = created_count + updated_count + skipped_count
        self.log(f"✅ Sincronização de issues concluída:")
        self.log(f"   📊 Total processadas: {total_processed}")
        self.log(f"   ➕ Criadas: {created_count}")
        self.log(f"   🔄 Atualizadas: {updated_count}")
        self.log(f"   ⏭️ Ignoradas: {skipped_count}")

    def generate_issues_report(self):
        """Gera relatório específico de issues"""
        try:
            github_issues = self.get_github_issues()
            gitlab_issues = self.get_gitlab_issues()
            
            # Estatísticas por estado
            github_open = sum(1 for issue in github_issues if issue['state'] == 'open')
            github_closed = len(github_issues) - github_open
            
            gitlab_open = sum(1 for issue in gitlab_issues if issue.state == 'opened')
            gitlab_closed = len(gitlab_issues) - gitlab_open
            
            report = f"""## 📋 Relatório de Issues - {datetime.now().strftime('%d/%m/%Y %H:%M')}

### GitHub Issues
- **Total**: {len(github_issues)}
- **Abertas**: {github_open}
- **Fechadas**: {github_closed}

### GitLab Issues  
- **Total**: {len(gitlab_issues)}
- **Abertas**: {gitlab_open}
- **Fechadas**: {gitlab_closed}

### Status de Sincronização
- **Sincronização**: {'✅ OK' if len(gitlab_issues) >= len(github_issues) else '⚠️ Pendente'}
- **Diferença**: {len(github_issues) - len(gitlab_issues)} issues

### Labels Mais Usadas
{self._get_top_labels(github_issues)}
"""
            
            print(report)
            return report
            
        except Exception as e:
            self.log(f"❌ Erro ao gerar relatório: {str(e)}", "ERROR")
            return ""

    def _get_top_labels(self, issues: List[Dict], top_n: int = 5) -> str:
        """Obtém as labels mais usadas"""
        label_count = {}
        
        for issue in issues:
            for label in issue.get('labels', []):
                label_name = label['name']
                label_count[label_name] = label_count.get(label_name, 0) + 1
        
        # Ordenar por uso
        sorted_labels = sorted(label_count.items(), key=lambda x: x[1], reverse=True)
        
        result = []
        for label, count in sorted_labels[:top_n]:
            result.append(f"- **{label}**: {count} issues")
        
        return '\n'.join(result) if result else "- Nenhuma label encontrada"

def main():
    """Função principal"""
    try:
        syncer = GitHubIssuesSyncer()
        syncer.sync_issues()
        syncer.generate_issues_report()
        
    except Exception as e:
        print(f"❌ ERRO CRÍTICO na sincronização de issues: {str(e)}")
        exit(1)

if __name__ == "__main__":
    main()