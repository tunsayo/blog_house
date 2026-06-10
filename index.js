const form = document.getElementById("form");
const title = document.getElementById("title");
const content = document.getElementById("body");
const selectimage = document.getElementById("select-image");
const previewimage = document.getElementById("preview-image");

const spin = document.getElementById("loader");

// -- overlay blur --
const sidebar = document.getElementById("sidebar-wrapper");
const overlay = document.getElementById("overlay");
const pagecontent = document.getElementById("page-content");

overlay.addEventListener("click", () => {
  sidebar.style.visibility = "hidden";
  overlay.style.visibility = "hidden";
  overlay.style.opacity = "0";
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

  try {
    const response = await fetch(
    `https://6a10aacfd2a98570703707be.mockapi.io/posts/${id}`,
    {
      method: "GET",
    },
    );
    if (!response.ok) {
      throw new Error();
      return;
    }
    data = await response.json();
    title.value = data.title;
    content.value = data.body;
    selectimage.value = data.image;
  } catch (err) {
  }
}
// -- end of side bar --

// -- update blog --
const updatebtn = document.getElementById("update-btn");

updatebtn.addEventListener("click", async () => {
  const result = await Swal.fire({
    icon: "warning",
    title: "Update Blog",
    text: "This action cannot be undone..",
    showCancelButton: true,
    confirmButtonText: "Yes, Update",
  });
  if (!result.isConfirmed) {
    return;
  }
  Swal.fire({
    title: "Updating...",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
  try {
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
    if (!response.ok) {
      throw new Error();
      return;
    }
    Swal.close();
    const ne = await Swal.fire({
      icon: "success",
      title: "Edit Blog",
      text: "Blog updated successfully",
      timer: "4000",
    })
    if (ne.isConfirmed) {
      window.location.reload();
    }
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Edit Blog",
      text: "Failed to update blog",
      timer: "4000",
    });
  }
})
// -- end of update blog --

// -- delete blog post --
async function deleteblog(id) {
  const result = await Swal.fire({
    icon: "warning",
    title: "Delete Blog",
    text: "This action cannot be undone..",
    showCancelButton: true,
    confirmButtonText: "Yes, Delete",
  });
  if (!result.isConfirmed) {
    return;
  }
  Swal.fire({
    title: "Deleting...",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  })
  try {
    const response = await fetch(
      `https://6a10aacfd2a98570703707be.mockapi.io/posts/${id}`,
      {
        method: "DELETE",
      },
    );
    if (!response.ok) {
      throw new Error();
      return;
    }
    Swal.close();
    const ne = Swal.fire({
      icon: "success",
      title: "Delete Blog",
      text: "Blog Deleted successfully",
      timer: "4000",
    });
    if (ne.isConfirmed) {
      fetchblog();
    }
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Delete Blog",
      text: "Failed to delete blog",
      timer: "4000",
    });
  }
  
}
// -- end of delete blog post --

// -- fetching blog post --

async function fetchblog() {
  try {
    spin.style.display = "flex"
    const response = await fetch(
      "https://6a10aacfd2a98570703707be.mockapi.io/posts",
      {
        method: "GET",
      },
    );
    if (!response.ok) {
      throw new Error();
      return;
    }
    data = await response.json();
    console.log(data);
    let sortdata = data.sort((a, b) => Number(b.id) - Number(a.id));
    displayblog(sortdata)
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Fetch Blog",
      text: "Check Your internet connection",
      timer: "4000",
    });
  } finally {
    spin.style.display = "none";
  }
}
fetchblog();
// -- end of fetch blog post --

// --  display blog --
const blogposts = document.getElementById("blog-posts");
function displayblog(items) {
  if (items.length === 0) {
    blogposts.innerHTML = `
    <div class="empty-state">
      <h2>No posts found/available..</h2>
    </div>`
    return;
  }
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