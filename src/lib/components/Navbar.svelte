<script lang="ts">
  import { page } from '$app/state';
</script>

<div class="w-screen h-20 bg-opacity-80 z-0 flex justify-center items-center gap-x-4 align-middle">
  <a href="/">Samuel's Music Reviews</a>
  <p>Songs</p>
  <p>Albums</p>
  <p>Artists</p>
  {#if page.data.session == null}
    <a href="/login">Login</a>
  {:else}
    <a href='/profile'>Profile</a>
  {/if}
</div>