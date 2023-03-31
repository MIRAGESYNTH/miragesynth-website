
const parser = new DOMParser();

// Sitewide Navigation
function goTo(link) {
  console.log(link);
}


// Slides creation

let content = null;
let template = null;

async function getContent() {
  if (!content) {
    // Wait for fetch to be over
    const response = await fetch('./mvs/content.json');
    const data = await response.json();  
      // assign the JSON data to a variable
      return data.games;
  };
  return content;
};

async function getTemplate() {
if (!template) {
  // Wait for fetch to be over
  const response = await fetch('./mvs/default.html');
  const html = await response.text();  
    // assign the HTML div to a variable
    const doc = parser.parseFromString(html, 'text/html');
    return doc.getElementById('mv-container');
};
return template;
};

function defaultview() {
  let firstview = false;
  for (let key in content) {
    if (content[key].default) {
      firstview = key.toString();
    };
  };
  if (!firstview) {
      firstview = "000";
  };
  return firstview;
};


function createMVs() {
  let views = [];
  for (let key in content) {
    var copy = template.cloneNode(true);
    copy.querySelector('.mv-background-image').src = content[key].background;
    copy.querySelector('.mv-title-text').innerHTML = content[key].title;
    copy.querySelector('.mv-text-presentation').innerHTML = content[key].description;
    copy.querySelector('.mv-trailer-video').src = content[key].video;

    let linkButtons = ["link-zero", "link-first", "link-second", "link-third"];
    let currentLink = 0;

    if (content[key].options.page) {
      currentLink += 1
      copy.querySelector('.mv-page-link').onclick = function() { goTo(content[key].references.page); };
      copy.querySelector('.mv-page-link').classList.add(linkButtons[currentLink]);
    } else {
        copy.querySelector('.mv-page-link').remove();
      };

    if (content[key].options.store) {
      currentLink += 1
      copy.querySelector('.mv-store-link').onclick = function() { goTo(content[key].references.store); };
      copy.querySelector('.mv-store-link').classList.add(linkButtons[currentLink]);
    } else {
        copy.querySelector('.mv-store-link').remove();
      };

    if (content[key].options.mobile) {
      currentLink += 1
      copy.querySelector('.mv-mobile-link').onclick = function() { goTo(content[key].references.mobile); };
      copy.querySelector('.mv-mobile-link').classList.add(linkButtons[currentLink]);
    } else {
        copy.querySelector('.mv-mobile-link').remove();
      };

    if (key == defaultview()){
      copy.classList.add('show');
    }
    document.querySelector('.main-view').appendChild(copy);

  };
  return views;
};

// Slides interaction
let slides = null;
let prevButton = null;
let nextButton = null;
let currentSlide = 0;

async function loadButtons() {
  if (!prevButton || !nextButton || !slides) {
    nextButton = await document.querySelector(".next-button");
    nextButton.addEventListener("click", nextSlide);
    prevButton = await document.querySelector(".prev-button");
    prevButton.addEventListener("click", prevSlide);
    slides = document.querySelectorAll(".mv-container");
  };
};

function showSlide() {
  slides.forEach((slide, index) => {
    if (index === currentSlide) {
      slide.classList.add("show");
    } else {
      slide.classList.remove("show");
    }
  });
}

function nextSlide() {
  currentSlide++;
  if (currentSlide >= slides.length) {
    currentSlide = 0;
  }
  showSlide();
}

function prevSlide() {
  currentSlide--;
  if (currentSlide < 0) {
    currentSlide = slides.length - 1;
  }
  showSlide();
}

// Blog previews

async function addBlogPreview() {

  const response = await fetch('./posts/posts.json');
  const data = await response.json();  
  let blogContent = data.posts;

  let blogPreviews = [];

  for (let key in blogContent) {
    blogPreviews.push(key);
  };

  blogPreviews.reverse();

  if ( blogPreviews.length > 8) {
      blogPreviews.length = 8;
    }

  let blogTemplate = document.querySelector('.bpp');

  const dictionary = ["zero", "one", "two", "three", "four", "five", "six", "seven"];
  for (let i = 0; i < blogPreviews.length; i++) {
    const copy = blogTemplate.cloneNode(true);
    copy.classList.add(dictionary[i]);
    document.querySelector('.bpc-articles').appendChild(copy);
  };

  blogTemplate.remove();

};


document.addEventListener("DOMContentLoaded", async function () {
    content = await getContent();
    template = await getTemplate();
    createMVs();
    currentSlide = parseInt(defaultview());

    await addBlogPreview()
    await loadButtons();



    resizeElements();
    activateElements();


  });


window.addEventListener('resize', function(event){
  resizeElements();
});


function resizeElements() {

  const r = document.querySelector(':root');
  r.style.setProperty('--window-size-width', window.innerWidth);
  const navBackground = document.querySelector('.nav-background');
  r.style.setProperty('--header-background-size', `${navBackground.height}px`);
  const navLink = document.querySelector('.nav-link');
  r.style.setProperty('--link-button-size', `${navLink.width}px`);
  const navIcon = document.querySelector('.nav-icon');
  r.style.setProperty('--icon-button-size', `${navIcon.width}px`);
  const separator = document.querySelector('.separator-background');
  r.style.setProperty('--separator-background-size', `${separator.height}px`);
  const mainView = document.querySelector('.main-view-background');
  r.style.setProperty('--main-view-background-size', `${mainView.height}px`);

  const title = document.querySelector('.mv-title-background');
  r.style.setProperty('--mv-title-background-size', `${title.height}px`);
  const overlay = document.querySelector('.mv-overlay-background');
  r.style.setProperty('--mv-overlay-background-size', `${overlay.height}px`);
  const text = document.querySelector('.mv-text-background');
  r.style.setProperty('--mv-text-background-size', `${text.width}px`);
  const trailer = document.querySelector('.mv-trailer-background');
  r.style.setProperty('--mv-trailer-background-size', `${trailer.width}px`);
  const links = document.querySelector('.mv-links-background');
  r.style.setProperty('--mv-links-background-size', `${links.width}px`);
  const link = document.querySelector('.mv-page-link');
  r.style.setProperty('--mv-link-background-size', `${link.height}px`);

  const secondaryView = document.querySelector('.news-bg');
  r.style.setProperty('--secondary-view-background-size', `${secondaryView.height}px`);

  const twitterContainer = document.querySelector('.twitter-container-background');
  r.style.setProperty('--twitter-container-background-size', `${twitterContainer.width}px`);

  const footerBackground = document.querySelector('.footer-bar-background');
  r.style.setProperty('--footer-bar-background-size', `${footerBackground.height}px`);

  const blogElements = [
    "bpc",
    "bpc-title",
    "bpc-articles",
    "bpc-nav",
    "bpp",
    "bpp-cover", 
    "bpp-category", 
    "bpp-date", 
    "bpp-title", 
    "bpp-button"
  ];

  blogElements.forEach((element) => {
    setSizeCSS(element);
  });

};

function setSizeCSS(name) {
  const r = document.querySelector(':root');
  console.log(`.${name}`);
  var element = document.querySelector(`.${name}-bg`);
  console.log(`--${name}-x`, `${element.width}px`)
  r.style.setProperty(`--${name}-x`, `${element.width}px`)
  console.log(`--${name}-y`, `${element.height}px`)
  r.style.setProperty(`--${name}-y`, `${element.height}px`)
};

function activateElements() {
  const r = document.querySelector(':root');
  r.style.setProperty('--show', 1);
};