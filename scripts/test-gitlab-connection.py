#!/usr/bin/env python3
"""
Script para testar conexão com GitLab AGES
"""
import os
import sys
import gitlab
from datetime import datetime

def test_gitlab_connection():
    """Testa a conexão com o GitLab"""
    
    # Configurações
    gitlab_url = os.getenv('GITLAB_URL', 'https://tools.ages.pucrs.br')
    gitlab_token = os.getenv('GITLAB_TOKEN')
    project_id = os.getenv('GITLAB_PROJECT_ID')
    
    print("🔍 Testando conexão GitLab...")
    print(f"URL: {gitlab_url}")
    print(f"Project ID: {project_id}")
    print(f"Token: {'✅ Definido' if gitlab_token else '❌ Não definido'}")
    print("-" * 50)
    
    if not gitlab_token:
        print("❌ GITLAB_TOKEN não está definido")
        return False
    
    if not project_id:
        print("❌ GITLAB_PROJECT_ID não está definido")
        return False
    
    try:
        # Conectar ao GitLab
        gl = gitlab.Gitlab(gitlab_url, private_token=gitlab_token)
        gl.auth()
        
        print("✅ Conexão com GitLab estabelecida")
        
        # Listar projetos disponíveis
        print("📋 Projetos disponíveis:")
        projects = gl.projects.list(owned=True, all=True)
        
        for project in projects[:5]:  # Mostrar apenas os primeiros 5
            print(f" - ID: {project.id}, Nome: {project.name}")
            if hasattr(project, 'path_with_namespace'):
                print(f"   Path: {project.path_with_namespace}")
        
        # Testar acesso ao projeto específico
        print(f"\n🎯 Testando acesso ao projeto ID: {project_id}")
        try:
            # Buscar projeto específico (isso retorna objeto completo)
            target_project = gl.projects.get(project_id)
            
            print(f"✅ Projeto encontrado: {target_project.name}")
            print(f"   Path: {target_project.path_with_namespace}")
            print(f"   Visibilidade: {target_project.visibility}")
            print(f"   URL: {target_project.web_url}")
            print(f"   Última atividade: {target_project.last_activity_at}")
            
            # Testar permissões básicas
            print(f"\n🔐 Testando permissões:")
            
            # Tentar listar branches
            try:
                branches = target_project.branches.list()
                print(f"✅ Acesso a branches: {len(branches)} branch(es) encontrada(s)")
                for branch in branches[:3]:  # Mostrar até 3 branches
                    print(f"   - {branch.name}")
            except Exception as e:
                print(f"❌ Erro ao acessar branches: {e}")
            
            # Tentar listar commits recentes
            try:
                commits = target_project.commits.list(per_page=3)
                print(f"✅ Acesso a commits: {len(commits)} commit(s) recente(s)")
                for commit in commits:
                    print(f"   - {commit.short_id}: {commit.title[:50]}...")
            except Exception as e:
                print(f"❌ Erro ao acessar commits: {e}")
            
            # Tentar listar issues
            try:
                issues = target_project.issues.list(per_page=3)
                print(f"✅ Acesso a issues: {len(issues)} issue(s) encontrada(s)")
            except Exception as e:
                print(f"❌ Erro ao acessar issues: {e}")
            
            print(f"\n✅ Teste concluído com sucesso!")
            return True
            
        except gitlab.exceptions.GitlabGetError as e:
            print(f"❌ Projeto ID {project_id} não encontrado ou sem acesso: {e}")
            return False
        except Exception as e:
            print(f"❌ Erro ao acessar projeto específico: {e}")
            return False
            
    except gitlab.exceptions.GitlabAuthenticationError:
        print("❌ Erro de autenticação: Token inválido")
        return False
    except gitlab.exceptions.GitlabError as e:
        print(f"❌ Erro do GitLab: {e}")
        return False
    except Exception as e:
        print(f"❌ Erro de conexão: {e}")
        return False

if __name__ == "__main__":
    success = test_gitlab_connection()
    sys.exit(0 if success else 1)