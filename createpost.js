const form = document.getElementById("form");
const title = document.getElementById("title");
const content = document.getElementById("content");
const selectimage = document.getElementById("image-url");
const previewimage = document.getElementById("preview-image");

selectimage.addEventListener("input", (e) => {
  previewimage.src = selectimage.value;
  previewimage.style.display = "flex";
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!selectimage) {
    alert("please select an image");
    return;
  }else if (!title.value && !content.value) {
    alert("provide the blog post");
    return;
  }
  try {
    const response = await fetch(
      "https://6a10aacfd2a98570703707be.mockapi.io/posts",
      {
        method: "POST",
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
      throw new Error(`problem occured while posting blog`);
      return;
    }
    const data = await response.json();
    console.log(data);
    alert("blog post created successfully!!")
    title.value = "";
    content.value = "";
    selectimage.value = "";
    previewimage.style.display = "none";
  } catch (err) {
    alert(err);
  }
});

