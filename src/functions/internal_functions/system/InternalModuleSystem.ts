import { UNSUPPORTED_MOBILE_TEMPLATE } from "Constants";
import { InternalModule } from '../InternalModule';
import { Platform } from "obsidian";
import { PromptModal } from "./PromptModal";
import { SuggesterModal } from "./SuggesterModal";

export class InternalModuleSystem extends InternalModule {
    public name: string = "system";

    async create_static_templates(): Promise<void> {
        this.static_functions.set("clipboard", this.generate_clipboard());
        this.static_functions.set("prompt", this.generate_prompt());
        this.static_functions.set("suggester", this.generate_suggester());
    }

    async create_dynamic_templates(): Promise<void> {}

    generate_clipboard(): Function {
        return async () => {
            // TODO: Add mobile support
            if (Platform.isMobileApp) {
                return UNSUPPORTED_MOBILE_TEMPLATE;
            }
            return await navigator.clipboard.readText();
        }
    }

    generate_prompt(): Function {
        return async (prompt_text?: string, default_value?: string, throw_on_cancel: boolean = false): Promise<string> => {
            const prompt = new PromptModal(this.app, prompt_text, default_value);
            const promise = new Promise((resolve: (value: string) => void, reject: (reason?: any) => void) => prompt.openAndGetValue(resolve, reject));
            try {
                return await promise;
            } catch(error) {
                if (throw_on_cancel) {
                    throw error;
                }
                return null;
            }
        }
    }

    generate_suggester(): Function {
        return async <T>(text_items: string[] | ((item: T) => string), items: T[], throw_on_cancel: boolean = false, placeholder: string = ""): Promise<T> => {
            const suggester = new SuggesterModal(this.app, text_items, items, placeholder);
            const promise = new Promise((resolve: (value: T) => void, reject: (reason?: any) => void) => suggester.openAndGetValue(resolve, reject));
            try {
                return await promise
            } catch(error) {
                if (throw_on_cancel) {
                    throw error;
                }
                return null;
            }
        }
    }
}