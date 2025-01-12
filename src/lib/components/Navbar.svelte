<script lang="ts">
  import { page } from '$app/stores';
</script>

<div class="w-screen h-20 bg-opacity-80 z-0 flex justify-center items-center gap-x-4 align-middle">
  <a href="/">Samuel's Music Reviews</a>
  <p>Songs</p>
  <p>Albums</p>
  <p>Artists</p>
  {#if $page.data.session == null}
    <p>Login</p>
  {:else}
    <p>Profile</p>
  {/if}
</div>