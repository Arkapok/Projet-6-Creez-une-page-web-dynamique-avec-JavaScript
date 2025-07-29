addEventListener("DOMContentLoaded", () => {
    let works = [];
    let addImage = "";
    let selectedCategory = "all";
    
    const modal = document.getElementsByClassName("modal")[0];
    const modalBackground = document.getElementsByClassName("modal-background")[0];
    const modalCloseButton = document.getElementsByClassName("modal-close")[0];
    const modalReturnButton = document.getElementsByClassName("modal-return")[0];
    const modifyButton = document.getElementsByClassName ("modify-button")[0]
    const editionBar = document.getElementsByClassName ("edition-bar")[0]
    const loginButton = document.getElementById("login");
    const logoutButton = document.getElementById("logout");
    const addGalleryButton = document.getElementsByClassName("add-to-gallery-button")[0];
    const addGalleryModal = document.getElementsByClassName("modal-add-to-gallery")[0];
    const modalGallery = document.getElementsByClassName("modal-gallery")[0];
    const addCategorySelector = document.getElementsByClassName("add-categories-selector-input")[0];
    const addSubmitButton = document.getElementsByClassName("add-submit-button")[0];
    const addImageInput = document.getElementsByClassName("add-image-input")[0];
    const addImageLabel = document.getElementsByClassName("add-image-label")[0];
    const addImageLabelType = document.getElementsByClassName("add-image-label-type")[0];
    const addPhotoSymbol = document.getElementsByClassName("add-image-add-photo-symbol")[0];

    function displayWorks() { 
        const workSelect = document.getElementsByClassName("gallery")[0];
        workSelect.innerHTML = ""; 
        if (selectedCategory !== "all") {       
            displayedWorks = works.filter(work => work.categoryId == selectedCategory);
        } else {
            displayedWorks = works; 
        }

        displayedWorks.forEach(work => {
            const figure = document.createElement("figure");
            const img = document.createElement("img");
            img.src = work.imageUrl;
            img.alt = work.title;
            const figcaption = document.createElement("figcaption");
            figcaption.textContent = work.title;
            figure.appendChild(img);
            figure.appendChild(figcaption);
            workSelect.appendChild(figure);
        });
    }

    //Modal for adding and deleting works
    function displayModalGalleryWork() {
        const modifyGallery = document.getElementsByClassName("modify-gallery")[0];
        modifyGallery.innerHTML = ""; 
        works.forEach(work => {
            const workDiv = document.createElement("div");
            workDiv.className = "modify-gallery-work";
            const img = document.createElement("img");
            img.src = work.imageUrl;
            img.alt = work.title;
            const deleteButton = document.createElement("span");
            deleteButton.className = "material-symbols-outlined modal-gallery-work-delete";
            deleteButton.textContent = "delete";
            deleteButton.addEventListener("click", () => {
                fetchData(`works/${work.id}`, "DELETE", true)
                    .then(() => {
                        works = works.filter(w => w.id !== work.id);
                        displayedWorks = displayedWorks.filter(w => w.id !== work.id);
                        displayWorks();
                        displayModalGalleryWork();
                    })
                    .catch(error => {
                        console.error("Failed to delete work:", error);
                    });
            });

            workDiv.appendChild(img);
            workDiv.appendChild(deleteButton);
            modifyGallery.appendChild(workDiv);
        });
    }

    fetchData(
        "works" 
    ).then(fetchedWorks => {
        works = fetchedWorks;
        displayedWorks = works;
        displayWorks(); 
        displayModalGalleryWork();
    }).catch(error => {
        console.error("Failed to load works:", error);
    });

    fetchData(
        "categories"
    ).then(categories => { // Use categories for the filter 
        const filterSelect = document.getElementsByClassName("categories-filter")[0];
        categories.forEach(category => { 
            const label = document.createElement("label");
            label.textContent = category.name;
            label.className = "category-filter-label";
            const input = document.createElement("input");
            input.value = category.id;
            input.type = "radio";
            input.name = "category-filter";
            input.className = "category-filter-radio";
            
            label.appendChild(input);
            filterSelect.appendChild(label);
        });
        filterSelect.children[0].firstChild.checked = true;
        filterSelect.addEventListener("change", (event) => {
            const category = event.target.value;
            console.log(`Selected category: ${category}`);
            if (category === "all") {
                selectedCategory = "all";
            } else {
                selectedCategory = category
            }
            displayWorks();
        });

        categories.forEach(category => {    
            const option = document.createElement("option");
            option.value = category.id;
            option.className = "add-categories-selector-option";
            option.textContent = category.name;
            addCategorySelector.appendChild(option);
        });
        addCategorySelector.value = null;
    })
    

    const token = localStorage.getItem("token");

    if (token) { // If token, User logged in 
        loginButton.style.display = "none";
        logoutButton.style.display = "block";
        const filterSelect = document.getElementsByClassName("categories-filter")[0];
        filterSelect.style.display = "none";
        editionBar.style.display = "flex"
        modifyButton.style.display = "flex"
        modal.style.display = "none"
        modalBackground.style.display = "none"

        logoutButton.addEventListener("click", () => {
            localStorage.removeItem("token");
            window.location.href = "index.html";
        });

        modalCloseButton.addEventListener("click", () => {
            const modal = document.getElementsByClassName("modal")[0];
            const modalBackground = document.getElementsByClassName("modal-background")[0];
            modal.style.display = "none";
            modalBackground.style.display = "none";
        });

        modifyButton.addEventListener("click", () => {
            modal.style.display = "flex";
            modalBackground.style.display = "block";
            modalGallery.style.display = "block";
            addGalleryModal.style.display = "none";
            modalReturnButton.style.display = "none";
        });

        modalReturnButton.addEventListener("click", () => {
            modalGallery.style.display = "block";
            addGalleryModal.style.display = "none";
            modalReturnButton.style.display = "none";
        });

        addGalleryButton.addEventListener("click", () => {
            addGalleryModal.style.display = "flex";
            modalGallery.style.display = "none";
            modal.style.display = "flex";
            modalBackground.style.display = "block";
            modalReturnButton.style.display = "block";
        })

        addImageInput.addEventListener("change", (event) => {
            const file = event.target.files[0]; 
            if (file) {
                const reader = new FileReader();
                addImage = file
                reader.onload = (event) => {
                    const previewImage = document.getElementsByClassName("add-image-preview")[0];
                    previewImage.src = event.target.result;
                    previewImage.style.display = "block";
                }
                reader.readAsDataURL(file);
                addImageLabel.style.display = "none";
                addImageLabelType.style.display = "none";
                addPhotoSymbol.style.display = "none";
            }
        });

        addSubmitButton.addEventListener("click", () => {
            const titleInput = document.getElementsByClassName("add-title-input")[0];
            const title = titleInput.value;
            const categoryId = addCategorySelector.value;

            if (title && addImage && categoryId) {
                const formData = new FormData();
                formData.append("title", title);
                formData.append("image", addImage);
                formData.append("category", categoryId);
                
                fetchData("works", "POST", true, formData).then(newWork => {
                    works.push(newWork);
                    displayWorks();
                    displayModalGalleryWork();
                    modal.style.display = "none";
                    modalBackground.style.display = "none";
                    addImage = null;
                    addImageLabel.style.display = "block";
                    addImageLabelType.style.display = "block";
                    addPhotoSymbol.style.display = "block";
                    const previewImage = document.getElementsByClassName("add-image-preview")[0];
                    previewImage.style.display = "none";
                    previewImage.src = null;
                    titleInput.value = null;
                    addCategorySelector.value = null;
                    addImageInput.files = null;
                }).catch(error => {
                    console.error("Failed to add work:", error);
                });
            } else {
                alert("Veuillez remplir tous les champs.");
            }
        });
        
    } else { // If no tken , User logged out
        loginButton.style.display = "block";
        logoutButton.style.display = "none";
        editionBar.style.display = "none"
        modifyButton.style.display = "none"
        modal.style.display = "none"
        modalBackground.style.display = "none"
    }

})

