# school-management-system
Ghana School Digital Ecosystem

## AI tooling — MCP servers

This repo ships project-scoped [Model Context Protocol](https://modelcontextprotocol.io)
config so editors and CLI agents pick up the same tooling automatically.

### Magic UI (`magicuidesign-mcp`)

Provides design-time access to the [Magic UI](https://magicui.design) component
registry — animated React/Tailwind components used for polished dashboards,
marketing pages and data surfaces.

Package: [`@magicuidesign/mcp`](https://www.npmjs.com/package/@magicuidesign/mcp) (current: `2.0.0`)

Tools exposed:

| Tool | Purpose |
| --- | --- |
| `searchRegistryItems` | Keyword/use-case search across the registry |
| `listRegistryItems` | Browse all items, filterable by `kind` / `query`, paginated |
| `getRegistryItem` | Full detail for one component, optionally with source and examples |

#### Config files in this repo

| File | Client |
| --- | --- |
| `.mcp.json` | Claude Code (project scope) |
| `.cursor/mcp.json` | Cursor |
| `.vscode/mcp.json` | VS Code / GitHub Copilot |

Each declares the same server:

```json
{
  "mcpServers": {
    "magicuidesign-mcp": {
      "command": "npx",
      "args": ["-y", "@magicuidesign/mcp@latest"]
    }
  }
}
```

> VS Code uses a `servers` key instead of `mcpServers`, and requires
> `"type": "stdio"` on each entry — see `.vscode/mcp.json`.

#### Requirements

- Node.js 18+ and `npx` on `PATH`.
- Outbound network access to `magicui.design` (the server pulls its registry
  from `https://magicui.design/registry.json` at call time).
- **Windows (native, not WSL):** `npx` is a `.cmd` shim and some clients will
  not resolve it. Change the command to:
  ```json
  { "command": "cmd", "args": ["/c", "npx", "-y", "@magicuidesign/mcp@latest"] }
  ```

#### Pinning

`@latest` tracks upstream releases. For reproducible setups, pin the version:

```json
"args": ["-y", "@magicuidesign/mcp@2.0.0"]
```

#### After editing config

Reload the MCP server in your client:
- **Claude Code** — restart the session, then `/mcp` to confirm it connected.
- **Cursor** — Settings → MCP, toggle the server off/on.
- **VS Code** — run `MCP: List Servers`, then restart the server.

### Fallback when the registry is unreachable

The registry is also committed upstream at
[`magicuidesign/magicui/registry.json`](https://github.com/magicuidesign/magicui/blob/main/registry.json)
(210 items: 75 components, 133 examples). If `magicui.design` is blocked on your
network, read component source directly from that file instead of the MCP.
