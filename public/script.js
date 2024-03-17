const email=localStorage.getItem("tuseremail");
console.log(email);
document.getElementById("thome").setAttribute("value",email);
document.getElementById("rooms").setAttribute("value",email);
document.getElementById("tenantdashboard").setAttribute("value",email);