// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			/* 
				Added to use in hooks.server.ts, 
				for userID to used as a piece of server-side state
				to be accessed from any server-side end point
			*/
			userID: string | null;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
