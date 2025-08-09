# Sincronização GitLab AGES

Este repositório está configurado para sincronização automática com o GitLab da incubadora AGES.

## 🔧 Configuração

### Secrets necessários no GitHub:

- `GITLAB_TOKEN` - Personal Access Token do GitLab
- `GITLAB_PROJECT_ID` - ID do projeto no GitLab
- `GITLAB_URL` - https://tools.ages.pucrs.br
- `GITHUB_TOKEN` - Token automático do GitHub

## 🔄 Funcionamento

- **Automático**: Sincroniza a cada push, PR, issue
- **Periódico**: Verificação a cada 30 minutos
- **Manual**: Pode ser executado via GitHub Actions

## 📊 Monitoramento

Verifique os logs em: Actions → "Sincronização GitHub → GitLab AGES"
