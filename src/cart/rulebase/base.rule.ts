import { EngineContext } from "../dto/engine.dto";

export interface BaseRule {
    type: string;

    apply(ctx: EngineContext, params?: Record<string, any>): EngineContext ;

}