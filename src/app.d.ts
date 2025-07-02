// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
        interface Platform {
            env: {
                DB: D1Database;
                API_TOKEN: String,
                ACCOUNT: String
            }
            cf: CfProperties
            ctx: ExecutionContext
        }
    }
}

export {};