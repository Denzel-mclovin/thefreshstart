<template>

     <div class="temp_links">
        <span>TEMPORARY LINKS BLOCK:</span>
        <ul>
          <li>
            <NuxtLink to="/">
              Home
            </NuxtLink>

          </li>
          <li>
            <NuxtLink to="/confirmation">
              Confirmed
            </NuxtLink>
            
          </li>
          <li>
            <NuxtLink to="/disqualified">
              Disqualified
            </NuxtLink>
            
          </li>
        </ul>
       
       
       

      </div>



</template>

<style scoped lang="scss">


 .temp_links {
  
    width: 100%;
    height: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
    gap: 50px;

    span {
      font-size: 18px;
      font-weight: 500;
      color: var(--dark-green);
    }

    ul {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 20px;

      li {
        padding-bottom: 1px;
        border-bottom: 1px solid var(--dark-green);
      }
    }

    @media screen and (max-width: 768px) {
      flex-direction: column;
      gap: 10px;
    }
  }


</style>