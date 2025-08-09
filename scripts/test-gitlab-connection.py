#!/usr/bin/env python3
"""
Script para testar e debuggar conexão com GitLab AGES
"""

import os
import gitlab

def test_gitlab_connection():
    """Testa conexão e lista projetos disponíveis"""
    
    # Configurações
    gitlab_url = os.environ.get('GITLAB_URL', 'https://tools.ages.pucrs.br')
    gitlab_token = os.environ.get('GITLAB_TOKEN')
    gitlab_project_id = os.environ.get('GITLAB_PROJECT_ID')
    
    print(f"🔍 Testando conexão GitLab...")
    print(f"URL: {gitlab_url}")
    print(f"Project ID: {gitlab_project_id}")
    print(f"Token: {'✅ Definido' if gitlab_token else '❌ Não definido'}")
    print("-" * 50)
    
    if not gitlab_token:
        print("❌ GITLAB_TOKEN não definido")
        return False
    
    try:
        # Conectar ao GitLab
        gl = gitlab.Gitlab(gitlab_url, private_token=gitlab_token)
        gl.auth()
        print("✅ Conexão com GitLab estabelecida")
        
        # Listar projetos disponíveis
        print("\n📋 Projetos disponíveis:")
        projects = gl.projects.list(owned=True, simple=True, per_page=50)
        
        if not projects:
            print("❌ Nenhum projeto encontrado")
            
            # Tentar listar todos os projetos (incluindo não-owned)
            print("\n🔍 Tentando listar todos os projetos acessíveis...")
            all_projects = gl.projects.list(membership=True, simple=True, per_page=50)
            
            for proj in all_projects:
                print(f"  - ID: {proj.id}, Nome: {proj.name}")
                print(f"    Path: {proj.path_with_namespace}")
                print(f"    Visibility: {proj.visibility}")
                print(f"    URL: {proj.web_url}")
                print()
        else:
            for proj in projects:
                print(f"  - ID: {proj.id}, Nome: {proj.name}")
                print(f"    Path: {proj.path_with_namespace}")
                print(f"    Visibility: {proj.visibility}")
                print()
        
        # Tentar acessar o projeto específico
        if gitlab_project_id:
            print(f"\n🎯 Testando acesso ao projeto ID {gitlab_project_id}...")
            try:
                project = gl.projects.get(gitlab_project_id)
                print(f"✅ Projeto encontrado: {project.name}")
                print(f"   Path: {project.path_with_namespace}")
                print(f"   URL: {project.web_url}")
                return True
            except gitlab.exceptions.GitlabGetError as e:
                print(f"❌ Erro ao acessar projeto: {e}")
                if e.response_code == 404:
                    print("💡 O projeto não existe ou você não tem acesso a ele")
                elif e.response_code == 403:
                    print("💡 Você não tem permissão para acessar este projeto")
                return False
        
        return True
        
    except Exception as e:
        print(f"❌ Erro de conexão: {str(e)}")
        return False

if __name__ == "__main__":
    success = test_gitlab_connection()
    exit(0 if success else 1)
