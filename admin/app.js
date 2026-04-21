const API = "https://YOUR-WORKER.workers.dev";

async function login(){
  const res = await fetch(API + "/login", {
    method: "POST",
    body: JSON.stringify({
      user: user.value,
      pass: pass.value
    })
  });

  alert(await res.text());
}

async function publish(){
  const post = {
    title: title.value,
    slug: slug.value,
    category: category.value,
    tags: tags.value.split(","),
    content: content.value,
    date: new Date().toISOString()
  };

  await fetch(API + "/publish", {
    method: "POST",
    body: JSON.stringify(post)
  });

  alert("Published");
}