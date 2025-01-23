<script lang="ts">
  import { page } from '$app/state';
  import { Dropdown, Navbar, NavBrand, NavLi, NavUl, NavHamburger} from 'flowbite-svelte';
  console.log(page.data);
</script>

<Navbar let:hidden let:toggle>
  <NavBrand href="/" >
    <p>Samuel's Music Reviews</p>
  </NavBrand>
  <NavHamburger on:click={toggle}/>
  <NavUl class="pt-2">
    <NavLi><p>Songs</p></NavLi>
    <NavLi><p>Albums</p></NavLi>
    <NavLi><p>Artists</p></NavLi>
    {#if page.data.user.admin}
      <NavLi><p>New Post</p></NavLi>
    {/if}
    {#if page.data.user != null}
      <NavLi>{page.data.user.name}</NavLi>
      <Dropdown>
        <p>Profile</p>
        <p>Logout</p>
      </Dropdown>
    {:else}
      <NavLi href="/login">Login</NavLi>
    {/if}
  </NavUl>
</Navbar>
