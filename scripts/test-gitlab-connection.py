#!/usr/bin/env python3
"""
Script para testar acesso específico ao projeto frontend pro-mata
"""

import os
import gitlab

def test_frontend_project():
    """Testa acesso ao projeto frontend específico"""
    
    gitlab_url = os.environ.get('GITLAB_URL', 'https://tools.ages.pucrs.br')
    gitlab_token = os.environ.get('GITLAB_TOKEN')
    
    # IDs dos projetos pro-mata encontrados
    PROMATA_PROJECTS = {
        'frontend': 807,
        'group': 1735  # Para referência
    }
    
    print(f"Testando acesso ao projeto frontend pro-mata...")
    print(f"URL: {gitlab_url}")
    print(f"Token: {'Definido' if gitlab_token else 'Nao definido'}")
    print("-" * 50)
    
    if not gitlab_token:
        print("GITLAB_TOKEN nao definido")
        return False
    
    try:
        # Conectar ao GitLab
        gl = gitlab.Gitlab(gitlab_url, private_token=gitlab_token)
        gl.auth()
        print("Conexao com GitLab estabelecida")
        
        # Testar acesso ao projeto frontend específico
        frontend_id = PROMATA_PROJECTS['frontend']
        print(f"\nTestando projeto frontend (ID: {frontend_id})...")
        
        try:
            project = gl.projects.get(frontend_id)
            print(f"SUCESSO - Projeto encontrado:")
            print(f"  - ID: {project.id}")
            print(f"  - Nome: {project.name}")
            print(f"  - Path: {project.path_with_namespace}")
            print(f"  - Visibility: {project.visibility}")
            print(f"  - URL: {project.web_url}")
            print(f"  - Default Branch: {project.default_branch}")
            
            # Verificar se é realmente o projeto correto
            if project.path_with_namespace == 'pro-mata/frontend':
                print(f"\nCONFIRMADO: Este e o projeto frontend correto!")
                
                # Testar algumas operações básicas
                print(f"\nTestando operacoes basicas...")
                
                # Listar branches
                try:
                    branches = project.branches.list()
                    print(f"  - Branches encontradas: {len(branches)}")
                    for branch in branches[:3]:  # Mostrar apenas as primeiras 3
                        print(f"    * {branch.name}")
                except Exception as e:
                    print(f"  - Erro ao listar branches: {e}")
                
                # Listar commits recentes
                try:
                    commits = project.commits.list(per_page=3)
                    print(f"  - Commits recentes: {len(commits)}")
                    for commit in commits:
                        print(f"    * {commit.short_id}: {commit.title[:50]}...")
                except Exception as e:
                    print(f"  - Erro ao listar commits: {e}")
                
                return True
            else:
                print(f"\nERRO: Path incorreto. Esperado 'pro-mata/frontend', encontrado '{project.path_with_namespace}'")
                return False
                
        except gitlab.exceptions.GitlabGetError as e:
            print(f"ERRO ao acessar projeto {frontend_id}: {e}")
            if e.response_code == 404:
                print("  - Projeto nao existe ou sem acesso")
            elif e.response_code == 403:
                print("  - Sem permissao para acessar")
            return False
        
        # Também verificar o grupo para contexto
        print(f"\nVerificando grupo pro-mata (ID: {PROMATA_PROJECTS['group']})...")
        try:
            group = gl.groups.get(PROMATA_PROJECTS['group'])
            print(f"  - Grupo: {group.name} ({group.path})")
            print(f"  - Full path: {group.full_path}")
            
            # Listar projetos do grupo
            group_projects = group.projects.list()
            print(f"  - Projetos no grupo: {len(group_projects)}")
            for proj in group_projects:
                print(f"    * {proj.id}: {proj.name} ({proj.path})")
                
        except Exception as e:
            print(f"  - Erro ao verificar grupo: {e}")
        
        return True
        
    except Exception as e:
        print(f"Erro de conexao: {str(e)}")
        return False

if __name__ == "__main__":
    success = test_frontend_project()
    print(f"\nResultado: {'SUCESSO' if success else 'FALHA'}")
    
    if success:
        print("\nPara usar nos seus scripts, configure:")
        print("GITLAB_PROJECT_ID=807")
    
    exit(0 if success else 1)