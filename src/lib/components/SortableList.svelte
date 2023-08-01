<script lang="ts">
    /* 
        FLIP: first, last, invert, play; 
        calculates the start and end postion of component to animate between them
    */
    import { flip } from "svelte/animate";
    // cED allows us to make a custom event, like when the items have been re-sorted
    import { createEventDispatcher } from "svelte";

    // Component input, the list of items we want to sort which we loop over with #each in the html
    export let list: any[];

    let isOver: string | boolean = false;

    const dispatch = createEventDispatcher();

    // Recursive function to determine the actual html function being dragged
    function getDraggedParent(node: any) {
        if (!node.dataset.index) {
            return getDraggedParent(node.parentNode);
        } else {
            return { ...node.dataset };
        }
    }

    function onDragStart(e: DragEvent) {
        // @ts-ignore
        const dragged = getDraggedParent(e.target);
        e.dataTransfer?.setData("source", dragged?.index.toString());
    }

    function onDragOver(e: DragEvent) {
        // @ts-ignore
        const id = e.target.dataset?.id;
        const dragged = getDraggedParent(e.target);
        isOver = dragged?.id ?? false;
    }

    function onDragLeave(e: DragEvent) {
        const dragged = getDraggedParent(e.target);
        isOver === dragged.id && (isOver = false);
    }

    /*
        Most import of helper functions:
        Calls reorder() which changes the actual order of the list
        which in turn will dispatch it to the parent component
        allowing us to update firestore
    */
     function onDrop(e: DragEvent) {
        isOver = false;
        const dragged = getDraggedParent(e.target);
        reorder({
            from: e.dataTransfer?.getData("source"),
            to: dragged.index,
        });
    }

    // Reorders list whenever it is sorted
    const reorder = ({ from, to }: any) => {
        const newList = [...list];
        newList[from] = [newList[to], (newList[to] = newList[from])][0];
        // Once sorted, creates custom event and dispatches it
        dispatch("sort", newList);
    };
</script>

<!-- 
    Notice: 
    A)
        in <slot {item} {index} /> 
        that <slot> has slot props, i.e. {item} & {index}
        this allows consumer of this component to access this data
        like our edit page so we can update our firestore db
    B)
        in our {#each} we loop over list
        but we also extract the index from the list
        and in parenthesis we use a key of item.id
        which makes this a keyed each block.
        Basically, allows Svelte to keep track of a unique identifier for each item, 
        allowing efficient render as we sort it
-->
{#if list?.length}
  <ul class="list-none p-0 flex flex-col items-center">
    {#each list as item, index (item.id)}
      <li
        class="border-2 border-dashed border-transparent p-2 transition-all max-w-md w-full"
        class:over={item.id === isOver}
        data-index={index}
        data-id={item.id}
        draggable="true"
        on:dragstart={onDragStart}
        on:dragover|preventDefault={onDragOver}
        on:dragleave={onDragLeave}
        on:drop|preventDefault={onDrop}
        animate:flip={{ duration: 300 }}
      >
        <slot {item} {index} />
      </li>
    {/each}
  </ul>
{:else}
  <p class="text-center my-12 text-lg font-bold">No items</p>
{/if}

<style>
  .over {
    @apply border-gray-400 scale-105;
  }
</style>