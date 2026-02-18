# 📁 Estrutura do Projeto Mediagrowth

## 🗂️ Organização de Arquivos

Esta é a estrutura organizada do projeto. Todos os arquivos foram reorganizados em pastas lógicas para facilitar a navegação e manutenção.

---

## 📂 Estrutura de Pastas

### 🏠 **Raiz do Projeto**
Arquivos principais da aplicação:
- `index.html` - Aplicação principal
- `admin-selector.html` - Seletor de área administrativa
- `admin-setup.html` - Configuração administrativa
- `approval.html` - Fluxo de aprovação
- `analise-aprovacao.html` - Análise de aprovações
- `calendario-publico.html` - Calendário público
- `demanda-plano.html` - Gestão de demandas
- `metas-form.html` - Formulário de metas
- `planejamento-publico.html` - Planejamento compartilhado
- `plano.html` - Plano de ação
- `relatorio.html` - Relatórios internos
- `relatorio-compartilhado.html` - Relatórios públicos

---

### 📚 **docs/** - Documentação Principal

#### 📝 `docs/changelogs/` - Histórico de Mudanças
Todos os arquivos `CHANGELOG_*.md` contendo:
- Novas funcionalidades implementadas
- Melhorias de features existentes
- Mudanças de comportamento
- Atualizações de sistema

**Total:** ~100+ changelogs organizados

#### 🔧 `docs/fixes/` - Correções e Fixes
Arquivos `FIX_*.md` e `CORRECAO_*.md`:
- Correções de bugs
- Fixes de segurança
- Ajustes de comportamento
- Resoluções de problemas

#### 📖 `docs/guias/` - Guias de Uso
Arquivos `GUIA_*.md` e `COMO_*.md`:
- Como usar funcionalidades
- Guias passo a passo
- Instruções de configuração
- Melhores práticas

#### 🎓 `docs/tutoriais/` - Tutoriais e Quick Start
Arquivos `TUTORIAL_*.md`, `QUICK_*.md`, `INDEX_*.md`:
- Tutoriais completos
- Guias rápidos de início
- Referências técnicas
- Exemplos práticos

#### 📊 `docs/resumos/` - Resumos e Compilações
Arquivos `RESUMO_*.md`:
- Resumos de funcionalidades
- Compilações de alterações
- Visões gerais de sistemas
- Documentação consolidada

#### 📄 `docs/*.md` - Documentação Geral
Outros documentos importantes:
- README específicos
- Documentação de configuração
- Análises estratégicas
- Especificações técnicas

---

### 🧪 **teste/** - Arquivos de Teste
Arquivos HTML de teste e validação:
- `test-login-bruno.html`
- `test-photo-location.html`
- Outros arquivos de teste

---

### 💾 **backup/** - Backups e Versões Antigas
Arquivos desabilitados e backups:
- `*.backup*` - Backups de arquivos
- `*.broken` - Versões com problemas
- `*.disabled` - Funcionalidades desabilitadas

---

### 🗑️ **arquivos-nao-utilizados/** - Utilitários Administrativos
Ferramentas administrativas e de manutenção:
- `clean-estruturacao.html`
- `clear-cache.html`
- `fix-admin-companies.html`
- `auto-clean.html`

---

## 🔍 Localizando Arquivos

### Por Tipo de Conteúdo:

#### Procurando um CHANGELOG?
```
📁 docs/changelogs/CHANGELOG_*.md
```

#### Procurando uma correção?
```
📁 docs/fixes/FIX_*.md
📁 docs/fixes/CORRECAO_*.md
```

#### Procurando um guia?
```
📁 docs/guias/GUIA_*.md
📁 docs/guias/COMO_*.md
```

#### Procurando um tutorial?
```
📁 docs/tutoriais/TUTORIAL_*.md
📁 docs/tutoriais/QUICK_*.md
```

#### Procurando um resumo?
```
📁 docs/resumos/RESUMO_*.md
```

---

## 📋 Estatísticas do Projeto

- **Total de Changelogs:** ~100+
- **Total de Fixes:** ~30+
- **Total de Guias:** ~15+
- **Total de Tutoriais:** ~10+
- **Total de Resumos:** ~15+
- **Arquivos HTML Principais:** ~13
- **Arquivos de Teste:** ~2
- **Backups:** ~3

---

## 🚀 Como Usar Este Projeto

1. **Desenvolvimento Local:**
   - Use `abrir-servidor.command` para iniciar o servidor local
   - Acesse através de `http://localhost:8000`

2. **Consultando Documentação:**
   - Navegue até `docs/` para toda documentação
   - Use os subdiretórios para encontrar tipos específicos

3. **Testando:**
   - Arquivos de teste estão em `teste/`
   - Execute individualmente conforme necessário

4. **Mantendo Organizado:**
   - Novos changelogs vão em `docs/changelogs/`
   - Novos fixes vão em `docs/fixes/`
   - Novos guias vão em `docs/guias/`
   - Novos tutoriais vão em `docs/tutoriais/`
   - Novos resumos vão em `docs/resumos/`

---

## 🔧 Manutenção

### Adicionando Novos Documentos:

```bash
# Changelog
mv CHANGELOG_NOVA_FEATURE.md docs/changelogs/

# Fix
mv FIX_NOVO_BUG.md docs/fixes/

# Guia
mv GUIA_NOVA_FUNCAO.md docs/guias/

# Tutorial
mv TUTORIAL_SETUP.md docs/tutoriais/

# Resumo
mv RESUMO_SISTEMA.md docs/resumos/
```

---

## 📞 Suporte

Para questões sobre a organização ou localização de arquivos, consulte:
1. Este README
2. Os READMEs específicos em `docs/README_*.md`
3. Os guias em `docs/guias/`

---

**Última Atualização:** 17 de fevereiro de 2026  
**Versão da Estrutura:** 1.0  
**Mantido por:** Equipe Mediagrowth
