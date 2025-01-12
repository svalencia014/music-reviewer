<script>
  export let data;
  console.log(data);
</script>


<svelte:head>
  <title>Samuel's Music Reviews</title>
</svelte:head>

<div>
  <h2>Recent Posts</h2>
  {#if data.data.length == 0}
    <p>There are no posts yet </p>
  {/if}
</div>