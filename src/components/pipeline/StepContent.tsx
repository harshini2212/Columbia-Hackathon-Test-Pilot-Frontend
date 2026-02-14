import { useState } from "react";
import { PIPELINE_STEPS } from "./PipelineSidebar";
import { Plus, Trash2, Globe, ArrowRight, Check, Shield, Play, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepContentProps {
  stepIndex: number;
  onComplete: () => void;
}

const UrlInputStep = ({ onComplete }: { onComplete: () => void }) => {
  const [urls, setUrls] = useState<string[]>([""]);

  const addUrl = () => setUrls([...urls, ""]);
  const removeUrl = (i: number) => setUrls(urls.filter((_, idx) => idx !== i));
  const updateUrl = (i: number, val: string) => {
    const updated = [...urls];
    updated[i] = val;
    setUrls(updated);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">URL Input</h1>
      <p className="text-muted-foreground mb-8">Feed API URLs to start the MCP generation pipeline. Each URL will be cloned, deployed, and processed.</p>
      
      <div className="space-y-3 mb-6">
        {urls.map((url, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="flex-1 flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-4 py-3">
              <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                type="url"
                value={url}
                onChange={(e) => updateUrl(i, e.target.value)}
                placeholder="https://github.com/org/repo or https://api.example.com/spec.json"
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none font-mono"
              />
            </div>
            {urls.length > 1 && (
              <button onClick={() => removeUrl(i)} className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button onClick={addUrl} className="flex items-center gap-2 rounded-lg border border-dashed border-border px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors">
          <Plus className="h-4 w-4" /> Add URL
        </button>
        <button
          onClick={onComplete}
          disabled={urls.every(u => !u.trim())}
          className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
        >
          Start Pipeline <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

const ProcessingStep = ({ title, description, items, onComplete }: { title: string; description: string; items: string[]; onComplete: () => void }) => {
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);

  const handleRun = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setDone(true);
    }, 1500);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <p className="text-muted-foreground mb-8">{description}</p>

      {!done ? (
        <div className="text-center py-12">
          <button
            onClick={handleRun}
            disabled={processing}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-70"
          >
            {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            {processing ? "Processing..." : `Run ${title}`}
          </button>
        </div>
      ) : (
        <div className="space-y-3 mb-8">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
              <Check className="h-4 w-4 text-success shrink-0" />
              <span className="text-sm font-mono text-foreground">{item}</span>
            </div>
          ))}
          <button
            onClick={onComplete}
            className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors ml-auto mt-4"
          >
            Continue <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

const PolicyStep = ({ onComplete }: { onComplete: () => void }) => {
  const tools = [
    { name: "addpet", method: "POST", path: "/pet", safety: "Write", execution: "Needs Confirm", rateLimit: 30 },
    { name: "createuser", method: "POST", path: "/user", safety: "Write", execution: "Needs Confirm", rateLimit: 30 },
    { name: "getinventory", method: "GET", path: "/store/inventory", safety: "Read", execution: "Auto Execute", rateLimit: 60 },
    { name: "search_pet", method: "GET", path: "/pet/findByStatus", safety: "Read", execution: "Auto Execute", rateLimit: 60 },
    { name: "search_user", method: "GET", path: "/user/{username}", safety: "Read", execution: "Auto Execute", rateLimit: 60 },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Policy Configuration</h1>
      <p className="text-muted-foreground mb-8">Configure safety rules, rate limits, and execution policies for each tool</p>

      <div className="rounded-xl border border-border overflow-hidden">
        <div className="grid grid-cols-[1fr_120px_140px_100px_40px] gap-4 px-6 py-3 border-b border-border text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <span>Tool</span>
          <span>Safety Level</span>
          <span>Execution</span>
          <span>Rate Limit</span>
          <span></span>
        </div>
        {tools.map((tool, i) => (
          <div key={tool.name} className={cn(
            "grid grid-cols-[1fr_120px_140px_100px_40px] gap-4 px-6 py-4 items-center border-b border-border last:border-b-0",
            i % 2 === 0 ? "bg-card" : "bg-muted/30"
          )}>
            <div>
              <div className="font-semibold text-foreground">{tool.name}</div>
              <div className="text-xs text-muted-foreground font-mono">{tool.method} {tool.path}</div>
            </div>
            <span className={cn(
              "inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium w-fit",
              tool.safety === "Read" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
            )}>
              {tool.safety}
            </span>
            <span className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium w-fit",
              tool.execution === "Auto Execute" ? "bg-success/10 text-success" : "bg-primary/10 text-primary"
            )}>
              <Shield className="h-3 w-3" />
              {tool.execution}
            </span>
            <span className="text-sm font-mono text-foreground">{tool.rateLimit} <span className="text-muted-foreground">/min</span></span>
            <div className="h-3 w-3 rounded-full border-2 border-muted-foreground/30" />
          </div>
        ))}
      </div>

      <button
        onClick={onComplete}
        className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors ml-auto mt-6"
      >
        Continue <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
};

const StepContent = ({ stepIndex, onComplete }: StepContentProps) => {
  const step = PIPELINE_STEPS[stepIndex];

  switch (step.id) {
    case "url-input":
      return <UrlInputStep onComplete={onComplete} />;
    case "clone":
      return <ProcessingStep title="Clone" description="Cloning repositories from the provided URLs." items={["Repository cloned: api-service", "Branch: main (HEAD)", "Files: 142 detected"]} onComplete={onComplete} />;
    case "deploy-sandbox":
      return <ProcessingStep title="Deploy Sandbox" description="Deploying sandbox environment via Blaxel for API extraction." items={["Container built: blaxel/sandbox:latest", "Endpoint: https://sandbox-abc123.blaxel.run", "Health check: ✓ 200 OK"]} onComplete={onComplete} />;
    case "extract":
      return <ProcessingStep title="Extract API Docs" description="Automatically extracting API documentation from the deployed service." items={["OpenAPI spec detected: v3.1.0", "Endpoints: 12 found", "Schemas: 8 models extracted", "Auth: Bearer token detected"]} onComplete={onComplete} />;
    case "ingest":
      return <ProcessingStep title="Ingest" description="Parsing and indexing the API specification." items={["Spec parsed: petstore-api v1.0.0", "Operations: 12 indexed", "Models: 8 registered"]} onComplete={onComplete} />;
    case "discover":
      return <ProcessingStep title="Discover" description="Mining capabilities, tools, and resources from the API." items={["Tools: 8 discovered", "Resources: 3 identified", "Prompts: 2 generated", "Capabilities mapped to MCP spec"]} onComplete={onComplete} />;
    case "schema":
      return <ProcessingStep title="Schema" description="Synthesizing and validating JSON type schemas." items={["Input schemas: 8 generated", "Output schemas: 8 generated", "JSON Schema validation: ✓ passed", "Type safety: 100%"]} onComplete={onComplete} />;
    case "policy":
      return <PolicyStep onComplete={onComplete} />;
    case "generate":
      return <ProcessingStep title="Generate" description="Generating the MCP server code using Blaxel." items={["Runtime: TypeScript + blaxel", "Tools: 8 implemented", "Resources: 3 implemented", "Server entry: index.ts generated"]} onComplete={onComplete} />;
    case "test":
      return <ProcessingStep title="Test" description="Running contract tests against the generated MCP server." items={["Test suite: 8 tests", "Passed: 8/8", "Coverage: 100%", "Response time: avg 42ms"]} onComplete={onComplete} />;
    case "deploy":
      return <ProcessingStep title="Deploy" description="Ship the MCP server to production on Blaxel." items={["Build: optimized bundle 2.1MB", "Deployed: https://mcp-petstore.blaxel.run", "Status: ✓ live", "MCP endpoint ready for Claude, OpenAI, Copilot"]} onComplete={onComplete} />;
    default:
      return <div className="text-muted-foreground">Step not implemented</div>;
  }
};

export default StepContent;
