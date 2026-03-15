const id = "1234";
fetch(`http://localhost:3000/api/products`)
  .then(r=>r.json())
  .then(d=> {
    if (!d.products || d.products.length === 0) return console.log("No products");
    const pid = d.products[0]._id;
    console.log("Found product to delete:", pid);
    return fetch(`http://localhost:3000/api/products/${pid}`, { method: 'DELETE' })
      .then(r=>r.json().then(res => ({status: r.status, data: res})))
      .then(res => console.log("Delete result:", res));
  })
  .catch(console.error);
