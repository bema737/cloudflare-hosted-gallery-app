<script lang="ts">
    import type { LandingPageResults } from '$lib/types';
	import type { PageData } from './$types';

    interface Props extends LandingPageResults {
        data: PageData
    };

    let { data }: Props = $props();
</script>

<svelte:head><title>{data.title}</title></svelte:head>

<section>
    <h1>{data.title}</h1>
    <ul>
        {#each data.links as link} 
            <li><a href={link.link}>{link.name}</a></li>
        {/each}
    </ul>
</section>

<style>

    :global(body) {
        background-color: var(--background-colour);
        overflow:hidden;
    }

    section {
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        padding: 0;
        margin: 0;
        height: 100vh;
        width: 100vw;
    }

    ul {
        list-style: none;
        display: flex;
        align-items: columns;
        gap: 1rem;
        padding: 0;
        margin: 0;
    } 

    li {
        margin-left: auto;
        margin-right: 1rem;
        padding: 0;
        background-color: var(--label-background-colour);
        border-style: solid var(--label-text-colour) 1px;
        padding: 1rem 2.5rem 1rem 2.5rem;
        width: 4rem;
        height: 0.6rem;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
    }

    a {
        text-decoration: none;
        line-height: 2rem;
        font-size: 1.6rem;
        font-family: "Poppins", serif;
        font-weight: 400;
        font-style: normal;
        color: var(--label-text-colour);
    }

    h1 {
        font-family: "Cardo", serif;
        font-weight: 450;
        font-size: 5rem;
        font-style: italic;
        color: var(--heading-colour);
        text-align: center;
        width: 80vw;
        margin-bottom: 5rem;
    }

    :root {
        --background-colour: #415a49;
        --label-text-colour: #295242;
        --heading-colour: #ffbfb6;
        --label-background-colour: #fff;
        --image-wait-notice-colour: #3f6455;
        --image-background-colour: #295242;
        font-size: 20px;

    }

    @media (max-width: 600px) {
        :root {
            font-size: 16px;
        }
    }

    @media (max-width: 450px) {
        :root {
            font-size: 12px;
        }
    }
</style>