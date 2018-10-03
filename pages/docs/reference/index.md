---
layout: reference
title: "Reference"
---

# Reference

Provides a complete reference to the Kotlin language and the [standard library](/api/latest/jvm/stdlib/index.html).

### Where to Begin

This reference is designed for you to easily learn Kotlin in a matter of hours.
Start with the [basic syntax](basic-syntax.html), then proceed to more advanced topics.
While reading, you can try out the examples in the [online IDE](https://play.kotlinlang.org).

Once you get an idea of what Kotlin looks like, try solving some [Kotlin Koans](/docs/tutorials/koans.html) - interactive programming exercises.
If you are not sure how to solve a Koan, or you're looking for a more elegant solution, check out [Kotlin idioms](idioms.html).


### Browse Offline
You can download the entire reference documentation as a single [PDF file]({{ site.pdf_url }}).

<script>
function switchDisplay(element, targetClass) {
    if(!element.classList.contains(targetClass)) {
       element.style.display = "none";
    } else {
       element.style.display = "list-item";
    }
}
window.onload = function () {
    const material = document.getElementById('material');
    const start = document.getElementById('start');
    const migrate = document.getElementById('migrate');
    const selectedBorder = '1px solid #5585B8';
    
    material.style.border = selectedBorder;

    const elements = Array.from(document.querySelectorAll(".a, .b"));
    material.addEventListener('click', function (event) {
        event.target.style.border = selectedBorder;
        [start, migrate].forEach(el => el.style.border = 'none');
        elements.forEach(el => {
            el.style.display = "list-item"
        })
    });

    start.addEventListener('click', function (event) {
        event.target.style.border = selectedBorder;
        [material, migrate].forEach(el => el.style.border = 'none');
        elements.forEach(el => switchDisplay(el,"a"));
    });

    migrate.addEventListener('click', function (event) {
        event.target.style.border = selectedBorder;
        [start, material].forEach(el => el.style.border = 'none');
        elements.forEach(el => switchDisplay(el,"b"));
    })
};
</script>
# **Learn Kotlin**
<div style="display: inline-flex; border: 1px solid rgb(229, 229, 229); border-radius: 40px;" >
 <div id="material" style="padding: 1rem 2rem;border-radius: 40px; border: 1px solid transparent;" >All Materials</div>
 <div id="start" style="padding: 1rem 2rem;border-radius: 40px;">Getting Started</div>
 <div id="migrate" style="padding: 1rem 2rem;border-radius: 40px;">Migrating from Java</div>
</div>
<div style="display:grid; grid-template-columns: 1fr 1fr;">
    <div >
        <h3 style="font-weight: bold">Documentation</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt</p>
        <ul>
            <li class="a" > <a style="text-decoration: none;">Docs</a> </li>
            <li class="a"> <a style="text-decoration: none;">Interop</a>  </li>
            <li class="a b"> <a style="text-decoration: none;">Basics and Idioms</a> </li>
        </ul>
    </div>
     <div >
         <h3 style="font-weight: bold">IDE</h3>
         <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt</p>
         <ul>
             <li class="a"> <a style="text-decoration: none;">Kotlin Educational Plugin</a> </li>
             <li class="b"> <a style="text-decoration: none;">Java2Kotlin converter</a>  </li>
         </ul>
     </div>
      <div >
          <h3 style="font-weight: bold">Ask community</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt</p>
          <ul>
              <li class="a"> <a style="text-decoration: none;">Slack</a> </li>
              <li class="a"> <a style="text-decoration: none;">Forum</a>  </li>
              <li class="b"> <a style="text-decoration: none;">Stack overflow</a> </li>
          </ul>
      </div>
      <div >
          <h3 style="font-weight: bold">Learn Kotlin</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt</p>
          <ul>
              <li class="b"> <a style="text-decoration: none;">Playground</a> </li>
              <li class="b"> <a style="text-decoration: none;">Kotlin Examples</a>  </li>
              <li class="a"> <a style="text-decoration: none;">Koans</a> </li>
          </ul>
      </div>
      <div >
          <h3 style="font-weight: bold">Books</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt</p>
          <ul>
              <li class="b"> <a style="text-decoration: none;">Atomic Kotlin</a> </li>
              <li class="a"> <a style="text-decoration: none;">Forum</a>  </li>
          </ul>
      </div>
      <div >
          <h3 style="font-weight: bold">Coursera</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt</p>
          <ul>
              <li class="b"> <a style="text-decoration: none;">Kotlin (RU)</a> </li>
              <li class="a"> <a style="text-decoration: none;">Kotlin for Java Developers</a>  </li>
          </ul>
      </div>
      <div >
          <h3 style="font-weight: bold">Get Certified Training</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt</p>
          <ul>
              <li class="a b"> <a style="text-decoration: none;">Link</a></li>
          </ul>
      </div>
      <div >
          <h3 style="font-weight: bold">Helpful resources</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt</p>
          <ul>
              <li class="a b"> <a style="text-decoration: none;">kotlin.link</a></li>
          </ul>
      </div>
            
</div>