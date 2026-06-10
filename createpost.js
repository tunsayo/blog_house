const form = document.getElementById("form");
const title = document.getElementById("title");
const content = document.getElementById("content");
const selectimage = document.getElementById("image-url");
const previewimage = document.getElementById("preview-image");

const spin = document.getElementById("loader");

selectimage.addEventListener("input", (e) => {
  previewimage.src = selectimage.value;
  previewimage.style.display = "flex";
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (selectimage.value === "") {
    await Swal.fire({
      icon: "warning",
      title: "Create Blog",
      text: "please select an image",
      timer: "4000",
    });
    return;
  }else if (!title.value || !content.value) {
    Swal.fire({
      icon: "warning",
      title: "Create Blog",
      text: "please provide blog details",
      timer: "4000",
    });
    return;
  }
  try {
    spin.style.display = "flex";
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
      throw new Error();
      return;
    }
    const data = await response.json();
    console.log(data);
    await Swal.fire({
      icon: "success",
      title: "Create Blog",
      text: "Blog created successfully",
      timer: "4000",
    });
    window.location.href = "index.html";
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Create Blog",
      text: "failed to create blog",
      timer: "4000",
    });
  } finally {
    spin.style.display = "none";
  }
});

