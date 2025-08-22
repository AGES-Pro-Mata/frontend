#!/usr/bin/env python3
"""
Script específico para sincronização de Pull Requests GitHub → GitLab AGES
Para uso no projeto Pro-Mata PUCRS
"""

import os
import json
import requests
import gitlab
from datetime import datetime
from typing import Dict, List, Optional

class GitHubPRSyncer:
    def __init__(self):
        """Inicializa o sincronizador de Pull Requests"""
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

    def get_github_prs(self) -> List[Dict]:
        """Busca Pull Requests do GitHub"""
        try:
            url = f"https://api.github.com/repos/{self.repo_name}/pulls"
            params = {'state': 'all', 'per_page': 100}
            
            prs = []
            page = 1
            
            while True:
                params['page'] = page
                response = requests.get(url, headers=self.github_headers, params=params)
                response.raise_for_status()
                
                page_prs = response.json()
                if not page_prs:
                    break
                    
                prs.extend(page_prs)
                page += 1
                
                if page > 10:  # Limitar para evitar loops infinitos
                    break
                
            self.log(f"Encontrados {len(prs)} Pull Requests no GitHub")
            return prs
            
        except Exception as e:
            self.log(f"❌ Erro ao buscar PRs do GitHub: {str(e)}", "ERROR")
            return []

    def get_gitlab_mrs(self) -> List:
        """Busca Merge Requests do GitLab"""
        try:
            mrs = self.project.mergerequests.list(all=True)
            self.log(f"Encontrados {len(mrs)} Merge Requests no GitLab")
            return mrs
        except Exception as e:
            self.log(f"❌ Erro ao buscar MRs do GitLab: {str(e)}", "ERROR")
            return []

    def get_gitlab_branches(self) -> List[str]:
        """Busca branches disponíveis no GitLab"""
        try:
            branches = self.project.branches.list(all=True)
            branch_names = [branch.name for branch in branches]
            self.log(f"Encontradas {len(branch_names)} branches no GitLab")
            return branch_names
        except Exception as e:
            self.log(f"❌ Erro ao buscar branches do GitLab: {str(e)}", "ERROR")
            return []

    def create_gitlab_mr(self, github_pr: Dict) -> Optional[object]:
        """Cria Merge Request no GitLab baseado no PR do GitHub"""
        try:
            # Preparar título - manter original
            title = github_pr['title']
            
            # Criar descrição preservando conteúdo original
            original_body = github_pr.get('body', '') or ''
            
            description = f"""{original_body}

---
## 🔄 Sincronizado do GitHub

- 🔗 **PR original**: {github_pr['html_url']}
- 👤 **Autor**: @{github_pr['user']['login']}
- 📅 **Criado**: {github_pr['created_at']}
- 🔢 **ID GitHub**: #{github_pr['number']}
- 🌿 **Branches**: `{github_pr['head']['ref']}` → `{github_pr['base']['ref']}`
- 📊 **Estado**: {github_pr['state']}
- 🔀 **Mergeable**: {github_pr.get('mergeable', 'unknown')}

*Sincronizado automaticamente do GitHub para GitLab AGES*
"""

            # Verificar se as branches existem no GitLab
            gitlab_branches = self.get_gitlab_branches()
            source_branch = github_pr['head']['ref']
            target_branch = github_pr['base']['ref']
            
            # Validar branches
            if source_branch not in gitlab_branches:
                self.log(f"⚠️ Branch origem '{source_branch}' não existe no GitLab", "WARN")
                # Tentar usar branch padrão como fallback
                source_branch = 'main' if 'main' in gitlab_branches else gitlab_branches[0] if gitlab_branches else 'main'
                
            if target_branch not in gitlab_branches:
                self.log(f"⚠️ Branch destino '{target_branch}' não existe no GitLab", "WARN") 
                # Usar branch padrão como fallback
                target_branch = 'main' if 'main' in gitlab_branches else gitlab_branches[0] if gitlab_branches else 'main'

            # Dados do Merge Request
            mr_data = {
                'source_branch': source_branch,
                'target_branch': target_branch,
                'title': title,
                'description': description,
                'remove_source_branch': False,
                'squash': False
            }
            
            # Criar MR no GitLab
            gitlab_mr = self.project.mergerequests.create(mr_data)
            
            # Aplicar estado se necessário
            if github_pr['state'] == 'closed':
                if github_pr.get('merged', False):
                    # PR foi merged - não podemos "merge" retroativamente, mas podemos fechar
                    pass  # GitLab MR fica aberto mas com nota de que foi merged no GitHub
                else:
                    # PR foi fechado sem merge
                    gitlab_mr.state_event = 'close'
                    gitlab_mr.save()
            
            self.log(f"✅ MR criado: !{gitlab_mr.iid} - {title[:50]}...")
            return gitlab_mr
            
        except Exception as e:
            self.log(f"❌ Erro ao criar MR no GitLab: {str(e)}", "ERROR")
            return None

    def update_gitlab_mr(self, gitlab_mr, github_pr: Dict):
        """Atualiza MR existente no GitLab se necessário"""
        try:
            # Verificar se precisa atualizar estado
            github_state = github_pr['state']
            gitlab_state = gitlab_mr.state
            
            # Sincronizar estados
            if github_state == 'closed' and gitlab_state != 'closed':
                if github_pr.get('merged', False):
                    # Adicionar nota de que foi merged no GitHub
                    note = f"✅ Este PR foi merged no GitHub em {github_pr.get('merged_at', 'data desconhecida')}"
                    gitlab_mr.notes.create({'body': note})
                    self.log(f"✅ Nota de merge adicionada ao MR !{gitlab_mr.iid}")
                else:
                    # Fechar MR
                    gitlab_mr.state_event = 'close'
                    gitlab_mr.save()
                    self.log(f"✅ MR !{gitlab_mr.iid} fechado para sincronizar com GitHub")
                    
            elif github_state == 'open' and gitlab_state == 'closed':
                gitlab_mr.state_event = 'reopen'
                gitlab_mr.save()
                self.log(f"✅ MR !{gitlab_mr.iid} reaberto para sincronizar com GitHub")
                
        except Exception as e:
            self.log(f"❌ Erro ao atualizar MR: {str(e)}", "ERROR")

    def save_pr_mapping(self, github_id: int, gitlab_iid: int):
        """Salva mapeamento entre PRs GitHub e MRs GitLab"""
        mapping_file = '.github/data/pr-mapping.json'
        
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
            self.log(f"❌ Erro ao salvar mapeamento de PR: {str(e)}", "ERROR")

    def load_pr_mapping(self) -> Dict[str, int]:
        """Carrega mapeamento existente entre PRs e MRs"""
        mapping_file = '.github/data/pr-mapping.json'
        
        try:
            if os.path.exists(mapping_file):
                with open(mapping_file, 'r') as f:
                    return json.load(f)
        except Exception as e:
            self.log(f"⚠️ Erro ao carregar mapeamentos de PR: {str(e)}", "WARN")
        
        return {}

    def sync_pull_requests(self):
        """Função principal de sincronização de Pull Requests"""
        self.log("🔄 Iniciando sincronização de Pull Requests GitHub → GitLab...")
        
        # Buscar PRs/MRs de ambas as plataformas
        github_prs = self.get_github_prs()
        gitlab_mrs = self.get_gitlab_mrs()
        
        # Carregar mapeamentos existentes
        existing_mappings = self.load_pr_mapping()
        
        # Criar índices para busca rápida
        gitlab_titles = {mr.title: mr for mr in gitlab_mrs}
        gitlab_by_iid = {mr.iid: mr for mr in gitlab_mrs}
        
        created_count = 0
        updated_count = 0
        skipped_count = 0
        
        for github_pr in github_prs:
            github_id = str(github_pr['number'])
            original_title = github_pr['title']
            
            # Verificar se já existe mapeamento
            if github_id in existing_mappings:
                gitlab_iid = existing_mappings[github_id]
                if gitlab_iid in gitlab_by_iid:
                    # MR já mapeado, verificar se precisa atualizar
                    self.update_gitlab_mr(gitlab_by_iid[gitlab_iid], github_pr)
                    updated_count += 1
                    continue
            
            # Verificar se já existe pelo título
            if original_title in gitlab_titles:
                # MR existe mas não está mapeado, criar mapeamento
                gitlab_mr = gitlab_titles[original_title]
                self.save_pr_mapping(github_pr['number'], gitlab_mr.iid)
                self.update_gitlab_mr(gitlab_mr, github_pr)
                updated_count += 1
                continue
            
            # MR não existe, criar novo
            gitlab_mr = self.create_gitlab_mr(github_pr)
            if gitlab_mr:
                self.save_pr_mapping(github_pr['number'], gitlab_mr.iid)
                created_count += 1
            else:
                skipped_count += 1
        
        # Relatório final
        total_processed = created_count + updated_count + skipped_count
        self.log(f"✅ Sincronização de Pull Requests concluída:")
        self.log(f"   📊 Total processados: {total_processed}")
        self.log(f"   ➕ Criados: {created_count}")
        self.log(f"   🔄 Atualizados: {updated_count}")
        self.log(f"   ⏭️ Ignorados: {skipped_count}")

    def generate_prs_report(self):
        """Gera relatório específico de PRs/MRs"""
        try:
            github_prs = self.get_github_prs()
            gitlab_mrs = self.get_gitlab_mrs()
            
            # Estatísticas por estado GitHub
            github_open = sum(1 for pr in github_prs if pr['state'] == 'open')
            github_closed = sum(1 for pr in github_prs if pr['state'] == 'closed')
            github_merged = sum(1 for pr in github_prs if pr.get('merged', False))
            
            # Estatísticas por estado GitLab
            gitlab_open = sum(1 for mr in gitlab_mrs if mr.state == 'opened')
            gitlab_closed = sum(1 for mr in gitlab_mrs if mr.state == 'closed')
            gitlab_merged = sum(1 for mr in gitlab_mrs if mr.state == 'merged')
            
            report = f"""## 🔄 Relatório de Pull Requests - {datetime.now().strftime('%d/%m/%Y %H:%M')}

### GitHub Pull Requests
- **Total**: {len(github_prs)}
- **Abertos**: {github_open}
- **Fechados**: {github_closed}
- **Merged**: {github_merged}

### GitLab Merge Requests
- **Total**: {len(gitlab_mrs)}
- **Abertos**: {gitlab_open}
- **Fechados**: {gitlab_closed}
- **Merged**: {gitlab_merged}

### Status de Sincronização
- **Sincronização**: {'✅ OK' if len(gitlab_mrs) >= len(github_prs) else '⚠️ Pendente'}
- **Diferença**: {len(github_prs) - len(gitlab_mrs)} PRs

### Branches Mais Ativas
{self._get_top_branches(github_prs)}
"""
            
            print(report)
            return report
            
        except Exception as e:
            self.log(f"❌ Erro ao gerar relatório de PRs: {str(e)}", "ERROR")
            return ""

    def _get_top_branches(self, prs: List[Dict], top_n: int = 5) -> str:
        """Obtém as branches mais usadas como origem"""
        branch_count = {}
        
        for pr in prs:
            branch = pr['head']['ref']
            branch_count[branch] = branch_count.get(branch, 0) + 1
        
        # Ordenar por uso
        sorted_branches = sorted(branch_count.items(), key=lambda x: x[1], reverse=True)
        
        result = []
        for branch, count in sorted_branches[:top_n]:
            result.append(f"- **{branch}**: {count} PRs")
        
        return '\n'.join(result) if result else "- Nenhuma branch encontrada"

def main():
    """Função principal"""
    try:
        syncer = GitHubPRSyncer()
        syncer.sync_pull_requests()
        syncer.generate_prs_report()
        
    except Exception as e:
        print(f"❌ ERRO CRÍTICO na sincronização de PRs: {str(e)}")
        exit(1)

if __name__ == "__main__":
    main()