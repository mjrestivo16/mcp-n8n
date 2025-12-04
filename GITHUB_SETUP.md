# GitHub Repository Setup Guide

This guide explains how to create and push the n8n MCP server to GitHub.

## Prerequisites

The GitHub MCP server requires authentication. You need to configure a GitHub Personal Access Token.

## Step 1: Create a GitHub Personal Access Token

1. Go to GitHub Settings: https://github.com/settings/tokens
2. Click "Generate new token" > "Generate new token (classic)"
3. Give it a descriptive name: "MCP GitHub Access"
4. Select the following scopes:
   - `repo` (Full control of private repositories)
   - `workflow` (Update GitHub Action workflows)
   - `write:packages` (Upload packages to GitHub Package Registry)
   - `delete:packages` (Delete packages from GitHub Package Registry)
5. Click "Generate token"
6. Copy the token immediately (you won't be able to see it again)

## Step 2: Configure GitHub MCP Server

Add the GitHub MCP configuration to your Claude Desktop config file:

**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "github": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your-token-here"
      }
    }
  }
}
```

Replace `your-token-here` with the token you generated.

## Step 3: Restart Claude Desktop

Close and reopen Claude Desktop to load the new configuration.

## Step 4: Create the GitHub Repository

Once authentication is configured, you can create the repository using these commands in Claude:

```
Create a GitHub repository named "mcp-n8n" with description "Model Context Protocol (MCP) server for n8n workflow automation - 27 tools for workflow management, execution control, credentials, and workflow templates" as a public repository.
```

## Step 5: Push Files to GitHub

After the repository is created, push all files:

```
Push the following files from C:\Users\Administrator\mcp-servers\n8n\ to the mcp-n8n repository on the main branch:
- README.md
- LICENSE
- .gitignore
- package.json
- tsconfig.json
- src/index.ts

Commit message: "Initial commit: n8n MCP server with 27 tools for workflow automation"
```

## Alternative: Manual Git Setup

If you prefer to use git commands directly:

### 1. Initialize Git Repository

```bash
cd C:\Users\Administrator\mcp-servers\n8n
git init
```

### 2. Create Repository on GitHub

Go to https://github.com/new and create a new repository:
- Repository name: `mcp-n8n`
- Description: `Model Context Protocol (MCP) server for n8n workflow automation - 27 tools for workflow management, execution control, credentials, and workflow templates`
- Public repository
- Do NOT initialize with README, .gitignore, or license (we have these files)

### 3. Add Remote and Push

```bash
# Add all files
git add README.md LICENSE .gitignore package.json tsconfig.json src/

# Commit
git commit -m "Initial commit: n8n MCP server with 27 tools for workflow automation

- 27 tools for comprehensive n8n workflow management
- Workflow management: list, get, create, update, delete, activate, deactivate, execute
- Execution control: list, get, retry, stop, delete executions
- Credentials management: list, get, create, update, delete credentials
- Tags management: list, create, update, delete tags, add to workflows
- Utilities: node types, webhooks, execution stats, health check
- 7 workflow templates for common automation patterns
- Full TypeScript implementation with MCP SDK
- Comprehensive README with usage examples and API reference"

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/mcp-n8n.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Files to be Pushed

The following files are ready to be pushed to GitHub:

1. **README.md** - Comprehensive documentation with:
   - Features overview (27 tools)
   - Installation instructions
   - Configuration guide
   - Usage examples
   - Complete tool reference
   - Development guide
   - Troubleshooting

2. **package.json** - Node.js package configuration with:
   - Dependencies: @modelcontextprotocol/sdk, axios, zod
   - Build scripts
   - Project metadata

3. **tsconfig.json** - TypeScript configuration

4. **src/index.ts** - Main server implementation (854 lines)
   - All 27 tool implementations
   - Workflow templates
   - Error handling
   - API client setup

5. **.gitignore** - Git ignore rules for:
   - node_modules/
   - dist/
   - .env files
   - IDE files
   - OS files

6. **LICENSE** - MIT License

## What NOT to Push

The following should NOT be pushed to GitHub:

- `node_modules/` - Dependencies (excluded by .gitignore)
- `dist/` - Build output (excluded by .gitignore)
- `.env` files - Environment variables with secrets (excluded by .gitignore)
- Any files containing your n8n API key or credentials

## Verification

After pushing, verify the repository at:
`https://github.com/YOUR_USERNAME/mcp-n8n`

You should see:
- README.md rendered on the repository home page
- All 6 files in the repository
- MIT License badge showing correctly
- Green "Public" badge

## Next Steps

After the repository is created:

1. Add topics to the repository:
   - `mcp`
   - `model-context-protocol`
   - `n8n`
   - `workflow-automation`
   - `typescript`

2. Enable GitHub Pages (optional) for documentation

3. Add a GitHub Actions workflow for automated builds (optional)

4. Share the repository URL in the MCP community

## Troubleshooting

### "Authentication Failed" Error
- Verify your GitHub token is correct
- Check that the token has the required scopes (`repo`)
- Ensure the token hasn't expired

### "Repository Already Exists" Error
- The repository name is taken
- Try a different name or delete the existing repository

### Permission Denied
- Verify you have write access to your GitHub account
- Check that the token has `repo` scope enabled

## Support

If you encounter issues:
- Check the MCP GitHub server documentation
- Review GitHub's authentication documentation
- Verify your token permissions
