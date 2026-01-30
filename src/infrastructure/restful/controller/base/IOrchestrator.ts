export interface IOrchestrator<OrchestratorInput, OrchestratorOutput> {
  execute(input: OrchestratorInput): Promise<OrchestratorOutput>;
}
