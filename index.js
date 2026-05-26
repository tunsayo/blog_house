const form = document.getElementById("form");
const title = document.getElementById("title");
const content = document.getElementById("body");
const selectimage = document.getElementById("select-image");
const previewimage = document.getElementById("preview-image");

// -- overlay blur --
const sidebar = document.getElementById("sidebar-wrapper");
const overlay = document.getElementById("overlay");
const pagecontent = document.getElementById("page-content");

overlay.addEventListener("click", () => {
  sidebar.style.visibility = "hidden";
  overlay.style.visibility = "hidden";
  overlay.style.opacity = "0";
  pagecontent.classList.remove("blur");
});
// -- end of overlay blur --

// -- display image url --
selectimage.addEventListener("input", (e) => {
  previewimage.src = selectimage.value;
  previewimage.style.display = "flex";
});
// -- end of display image --

let data = [];
// -- show edit sidebar --
let itemid = "";
async function edit(id) {
  itemid = id;
  sidebar.style.visibility = "visible";
  overlay.style.visibility = "visible";
  overlay.style.opacity = "1";
  pagecontent.classList.add("blur");

  const response = await fetch(
    `https://6a10aacfd2a98570703707be.mockapi.io/posts/${id}`,
    {
      method: "GET",
    },
  );
  data = await response.json();
  title.value = data.title;
  content.value = data.body;
  selectimage.value = data.image;
}
// -- end of side bar --

// -- update blog --
const updatebtn = document.getElementById("update-btn");

updatebtn.addEventListener("click", async () => {
  const response = await fetch(
    `https://6a10aacfd2a98570703707be.mockapi.io/posts/${itemid}`,
    {
      method: "PUT",
      body: JSON.stringify({
        title: title.value,
        body: content.value,
        image: selectimage.value,
      }),
      headers: {
        "Content-type": "application/json",
      },
    },
  );
  try {
    if (!response.ok) {
      throw new Error(`problem occured while updating blog`);
      return;
    }
    alert("blog post updated successfull!!")
    window.location.reload();
  } catch (err) {
    alert(err);
  }
})
// -- end of update blog --

// -- delete blog post --
async function deleteblog(id) {
  const response = await fetch(`https://6a10aacfd2a98570703707be.mockapi.io/posts/${id}`, {
    method: "DELETE",
  });
  try {
    if (!response.ok) {
      throw new Error(`problem occured while updating blog`);
      return;
    }
    alert("blog post deleted successfull!!");
    window.location.reload();
    fetchblog();
  } catch (err) {
    alert(err);
  }
  
}
// -- end of delete blog post --

// -- fetching blog post --

async function fetchblog() {
  const response = await fetch(
    "https://6a10aacfd2a98570703707be.mockapi.io/posts", {
      method: "GET",
    },);
  try {
    if (!response.ok) {
      throw new Error(`problem occured while fetching data`);
      return;
    }
    data = await response.json();
    console.log(data);
    let sortdata = data.sort((a, b) => Number(b.id) - Number(a.id));
    displayblog(sortdata)
  } catch (err) {
    alert(err);
  }
}
fetchblog();
// -- end of fetch blog post --

// --  display blog --
const blogposts = document.getElementById("blog-posts");
function displayblog(items) {
  blogposts.innerHTML = items.map((item) => `
  <div class="blog-posts">
    <img src="${item.image}" alt="${item.title} id="hovimg"/>
    <div class="modify-post" id="modify-posts">
      <span class="fa-solid fa-trash delete" id="delete" onclick="deleteblog(${item.id})"></span>
      <span class="fa-regular fa-pen-to-square  edit" id="edit" onclick="edit(${item.id})"></span>
    </div>
    <div class="blog-value">
      <h3>${item.title}</h3>
      <p>
        ${item.body}
      </p>
    </div>
  </div>`,
    )
    .join("");
}

// -- search blog post --
const search = document.getElementById("search");
search.addEventListener("input", () => {
  const searchtext = search.value.toLowerCase().trim();
  const searchblog = data.filter(item => {
    return (item.title.toLowerCase().includes(searchtext));
  });
  displayblog(searchblog);
});
// -- end of search blog post --

// -- sort blog --
const sort = document.getElementById("sortblog");
sort.addEventListener("change", () => {
  const sortvalue = sort.value;
  let sortblog = data;
  switch (sortvalue) {
    case "newest":
      sortblog.sort((a, b) => Number(b.id) - Number(a.id));
      break;
    case "oldest":
      sortblog.sort((a, b) => Number(a.id) - Number(b.id));
      break;
    case "a-z":
      // sortblog.sort((a, b) => a.title - b.title);
      sortblog.sort((a, b) => a.title.localeCompare(b.title));
      break;
  }
  displayblog(sortblog);
})
// -- sort blog --