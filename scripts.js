
const parser = new DOMParser();

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

    if (content[key].options.page) {
      copy.querySelector('.mv-buttons.page').classList.add('available');
      copy.querySelector('.mv-button-text.page').href = content[key].references.page;
    };
    if (content[key].options.store) {
      copy.querySelector('.mv-buttons.store').classList.add('available');
      copy.querySelector('.mv-button-text.store').href = content[key].references.store;
    };
    if (content[key].options.android) {
      copy.querySelector('.mv-buttons.android').classList.add('available');
      copy.querySelector('.mv-button-text.android').href = content[key].references.android;
    };

    if (key == defaultview()){
      copy.classList.add('show');
    };
    document.querySelector('.main-view').appendChild(copy)  
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
    prevButton = await document.querySelector(".prev-button");
    nextButton = await document.querySelector(".next-button");
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

let blogContent = null;
let blogTemplate = null;

async function getBlogContent() {
  if (!blogContent) {
    // Wait for fetch to be over
    const response = await fetch('./posts/posts.json');
    const data = await response.json();  
      // assign the JSON data to a variable
      return data.posts;
  };
  return blogContent;
};

async function getBlogTemplate() {
if (!blogTemplate) {
  // Wait for fetch to be over
  const response = await fetch('./posts/preview.html');
  const html = await response.text();  
    // assign the HTML div to a variable
    const doc = parser.parseFromString(html, 'text/html');
    return doc.querySelector('.blog-post-preview');
};
return blogTemplate;
};

 function createBlogPreview() {
  let views = [];
  console.log("starting operation");
  for (let key in blogContent) {
    console.log("looping");
    console.log(blogTemplate);
    var copy = blogTemplate.cloneNode(true);
    document.querySelector('.blog-preview-container').appendChild(copy);
    console.log("added child");  
  };
  return views;
};



document.addEventListener("DOMContentLoaded", async function () {
    content = await getContent();
    template = await getTemplate();
    createMVs();
    await loadButtons();
    nextButton.addEventListener("click", nextSlide);
    prevButton.addEventListener("click", prevSlide);

    blogContent = await getBlogContent();
    blogTemplate = await getBlogTemplate();
    createBlogPreview();
});


