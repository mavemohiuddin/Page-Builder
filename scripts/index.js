// =================================== Generics Scripts ===================================

let valueset = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];

const sel = (type, name) => {
    if (type == 1) {
        return document.querySelector(name);
    } else {
        return document.querySelectorAll(name);
    }
}

const make = (name, data_name, data_add, id, cls, htm, child) => {
    let ans = document.createElement(name);

    if (id != 1) {
        ans.setAttribute("id", id);
    }
    if (cls != 1) {
        ans.setAttribute("class", cls);
    }
    if (htm != 1) {
        ans.innerHTML = htm;
    }
    if (child != 1) {
        ans.appendChild(child);
    }

    if (data_name != "bread") {
        if (data_name != "1") {
            ans.setAttribute("data-active", "false");
            ans.setAttribute("data-id", data_id());
        }
    }
    if (data_add == 1) {
        ans.setAttribute("data-add", "false");
    } else {
        ans.setAttribute("data-add", data_add);
    }
    ans.setAttribute("data-name", data_name);
    return ans;
}

// =================================== Generic Identifier ===================================

let elem_panel = sel(1, ".elem_panel");
let edit_panel = sel(1, ".edit_panel");
let style_panel = sel(1, "[data-content='styles']");
let content_panel = sel(1, "[data-content='content']");
let page = sel(1, ".page");
let page_temp = sel(1, ".page_temp");
let bread = sel(1, ".breadcrumb");
let reserve = sel(1, "[data-reserve]");
let type_bar = elem_panel.querySelector(".type_bar");
let stylesheet = [];

// =================================== Generating unique id for each item; ===================================

const data_id = () => {
    let new_id = "";
    for (let i = 0; i < 16; i++) {
        let new_digit = valueset[Math.floor(Math.random() * valueset.length)];
        new_id += new_digit;
    }
    return new_id;
}

// =================================== Exporting HTML and CSS ===================================

sel(1, ".close_download").addEventListener("click", () => {
    sel(1, ".download_files").classList.add("display_none");
})
sel(1, ".export").addEventListener("click", () => {
    sel(1, ".download_files").classList.remove("display_none");

    // =================================== Exporting CSS ===================================

    page_temp.innerHTML = page.innerHTML;

    page_temp.querySelectorAll("[data-id]").forEach((item) => {
        if (item.hasAttribute("style")) {
            if (item.getAttribute("style").length > 0) {
                let export_style = "";
                if (item.hasAttribute("id")) {
                    if (item.getAttribute("id").length > 0) {
                        export_style += "#" + item.getAttribute("id") + " {" + item.getAttribute("style") + "}";
                    } else {
                        export_style += "[data-id='" + item.getAttribute("data-id") + "'] {" + item.getAttribute("style") + "}";
                    }
                } else {
                    export_style += "[data-id='" + item.getAttribute("data-id") + "'] {" + item.getAttribute("style") + "}";
                }
                sel(1, "#export_css").value = export_style;
            }
        }
    })

    // =================================== Exporting HTML ===================================

    page_temp.querySelectorAll("[data-active]").forEach((item) => item.removeAttribute("data-active"));
    page_temp.querySelectorAll("[data-name]").forEach((item) => item.removeAttribute("data-name"));
    page_temp.querySelectorAll("[data-add]").forEach((item) => item.removeAttribute("data-add"));
    page_temp.querySelectorAll("[style]").forEach((item) => item.removeAttribute("style"));
    page_temp.querySelectorAll("[bis_skin_checked]").forEach((item) => item.removeAttribute("bis_skin_checked"));
    page_temp.querySelectorAll("[class]").forEach((item) => {
        if (item.getAttribute("class").length <= 0) {
            item.removeAttribute("class");
        }
    })
    page_temp.querySelectorAll("[id]").forEach((item) => {
        if (item.getAttribute("id").length > 0) {
            item.removeAttribute("data-id");
        } else {
            item.removeAttribute("id");
        }
    });
    let page_html = page_temp.innerHTML;
    sel(1, "#export_html").value = page_html;
})

// =================================== Generating Breadcrumb ===================================

let bread_list = [];
let bread_target_list = [];

const selector = (data_id) => {
    let selector_temp = "[data-id='" + data_id + "']";
    sel(2, "[data-active]").forEach((item) => item.setAttribute("data-active", "false"));
    sel(1, selector_temp).setAttribute("data-active", "true");
    delete_unnecessary();
    open_edit_panel();
    bread_builder(sel(1, "[data-active='true']"));
}

const bread_builder = (me) => {
    bread.innerHTML = "";
    if (me.classList[0] == "page") {
        bread_list.reverse();
        bread_target_list.reverse();
        for (i in bread_list) {
            let bread_temp = make("p", "bread", 1, 1, 1, bread_list[i], 1);
            bread_temp.setAttribute("data-destination", bread_target_list[i]);
            bread_temp.addEventListener("click", (event) => {
                selector(event.target.getAttribute("data-destination"));
            })
            bread.appendChild(bread_temp);
        }
        bread_list = [];
    } else {
        if (me.getAttribute("data-name") != 1) {
            bread_list.push(me.getAttribute("data-name"));
            bread_target_list.push(me.getAttribute("data-id"));
        }
        bread_builder(me.parentElement);
    }
}

const listener = () => {
    page.addEventListener("click", (event) => {
        selector(event.target.getAttribute("data-id"));
    })
}

// =================================== Element panel ===================================

elem_panel.querySelectorAll("[data-heading]").forEach((item) => {
    item.addEventListener("click", ()=> {
        let content_temp = "[data-content='" + item.getAttribute("data-heading") + "']";
        let content = elem_panel.querySelector(content_temp); 
        if (content.classList.contains("display_none")) {
            content.classList.remove("display_none");
        } else {
            content.classList.add("display_none");
            type_bar.classList.remove("type_open");
        }
    })
});
const elem_panel_closer = () => {
    elem_panel.classList.add("close_elem");
    type_bar.classList.remove("type_open");
}
sel(1, ".elem_opener").addEventListener("click", () => {
    if (elem_panel.classList.contains("close_elem")) {
        elem_panel.classList.remove("close_elem");
    } else {
        elem_panel_closer();
    }
})

elem_panel.querySelectorAll("[data-element]").forEach((item) => {
    item.addEventListener("click", () => {
        type_opener(item.getAttribute("data-element"));
    })
})

// ==================== Creating visuals for item drawer ====================

const type_opener = (code_name) => {
    if (code_name == "div") {
        type_bar.innerHTML = reserve.querySelector("[data-reserve-type='containers']").innerHTML;
    } else if (code_name == "text") {
        type_bar.innerHTML = reserve.querySelector("[data-reserve-type='text']").innerHTML;
    } else if (code_name == "image") {
        type_bar.innerHTML = reserve.querySelector("[data-reserve-type='image']").innerHTML;
    } else {
        type_bar.innerHTML = reserve.querySelector("[data-reserve-type='maintainence']").innerHTML;
    }
    type_bar.classList.add("type_open");
    elem_panel.querySelectorAll("[data-spawn]").forEach((item) => {
        item.addEventListener("click", () => {
            item_spawn(item.getAttribute("data-spawn"));
        })
    })
}
const item_spawn = (item_name) => {
    if (item_name == "sec_01") {
        let new_item = make_row(1);
        let new_sec = make("section", "section", "section", 1, 1, 1, new_item)
        commit_add(new_sec);
    } else if (item_name == "col_01") {
        let new_item = make_row(1);
        commit_add(new_item);
    } else if (item_name == "col_02") {
        let new_item = make_row(2);
        commit_add(new_item); 
    } else if (item_name == "col_03") {
        let new_item = make_row(3);
        commit_add(new_item);
    } else if (item_name == "col_04") {
        let new_item = make_row(4);
        commit_add(new_item);
    } else if (item_name == "col_12") {
        let new_item = make_row(2);
        new_item.children[0].classList.add("row_12");
        commit_add(new_item);
    } else if (item_name == "col_21") {
        let new_item = make_row(2);
        new_item.children[0].classList.add("row_21");
        commit_add(new_item);
    } else if (item_name == "col_2x2") {
        let new_item = make_row(4);
        new_item.children[0].classList.add("wrap");
        commit_add(new_item);
    } else if (item_name == "block") {
        let new_item = make("div", "Block", "container", 1, 1, 1, 1);
        commit_add(new_item);
    } else if (item_name == "text_01") {
        let new_item = make("p", "Paragraph", "element", 1, 1, "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus asperiores ab laborum corporis possimus. Vitae sequi neque, iste eveniet facere saepe reprehenderit sed tempore, magnam voluptate velit asperiores nobis molestiae!", 1);
        commit_add(new_item);
    } else if (item_name == "text_02") {
        let new_item = make("p", "Paragraph", "element", 1, "initial", "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus asperiores ab laborum corporis possimus. Vitae sequi neque, iste eveniet facere saepe reprehenderit sed tempore, magnam voluptate velit asperiores nobis molestiae!", 1);
        commit_add(new_item);
    } else if (item_name == "img_01") {
        let new_item = make("img", "Image", "element", 1, "image", 1, 1);
        new_item.setAttribute("src", "./images/placeholder_01.png");
        commit_add(new_item);
    }
}

const make_row = (col_count) => {
    let mid_row = make("div", 1, 1, 1, "flex", 1, 1);
    for (let i=0; i<col_count; i++) {
        let new_column = make("div", "Column", "container", 1, 1, 1, 1);
        let mid_col = make("div", 1, 1, 1, 1, 1, new_column);
        mid_row.appendChild(mid_col);
    }
    mid_row.classList.add("width");
    return make("div", "Row", "host_container", 1, 1, 1, mid_row);
}

const commit_add = (this_item) => {
    let active_elem = sel(1, "[data-active=true");

    if (this_item.getAttribute("data-add") == "section") {
        page.appendChild(this_item);
    } else if (this_item.getAttribute("data-add") == "host_container") {
        if (page.childElementCount == 0) {
            let new_sec = make("section", "Section", "section", 1, 1, 1, this_item);
            page.appendChild(new_sec);
        } else {
            if (active_elem.getAttribute("data-add") == "element") {
                let active_parent = active_elem.parentElement;
                active_parent.appendChild(this_item);
            } else if (active_elem.getAttribute("data-add") == "host_container") {
                let active_parent = active_elem.parentElement;
                active_parent.appendChild(this_item);
            } else {
                active_elem.appendChild(this_item);
            }
        }
    } else if (this_item.getAttribute("data-name") == "Block") {
        if (page.childElementCount == 0) {
            let new_temp = make_container(this_item);
            let new_sec = make("section", "Section", "section", 1, 1, 1, new_temp);
            page.appendChild(new_sec);
        } else {
            let active_parent = active_elem.parentElement;
            if (active_elem.getAttribute("data-add") == "element") {
                active_parent.appendChild(this_item);
            } else if (active_elem.getAttribute("data-add") == "section") {
                let new_temp = make_container(this_item);
                commit_add(new_temp); 
            } else if (active_elem.getAttribute("data-add") == "host_container") {
                let new_temp = make_container(this_item);
                active_parent.appendChild(new_temp);
            } else {
                active_elem.appendChild(this_item);
            }
        }
    } else{ 
        if (page.childElementCount == 0) {
            let new_temp = make_container(this_item);
            commit_add(new_temp);
        } else {
            if (active_elem.getAttribute("data-add") == "container") {
                active_elem.appendChild(this_item);
            } else if (active_elem.getAttribute("data-add") == "section") {
                let new_temp = make_container(this_item);
                commit_add(new_temp);
            } else {
                let active_parent = active_elem.parentElement;
                if (active_parent.getAttribute("data-add") == "container") {
                    active_parent.appendChild(this_item);
                } else {
                    let new_temp = make_container(this_item);
                    commit_add(new_temp);
                }
            }
        }
    }
    selector(this_item.getAttribute("data-id"));
    elem_panel.classList.add("close_elem");
    type_bar.classList.remove("type_open");
}
const make_container = (this_item) => {
    let new_column = make("div", "Column", "container", 1, 1, 1, this_item);
    let mid_col = make("div", 1, 1, 1, 1, 1, new_column)
    let mid_row = make("div", 1, 1, 1, "flex", 1, mid_col);
    mid_row.classList.add("width");
    return make("div", "Row", "host_container", 1, 1, 1, mid_row);
}

// =================================== Edit panel ===================================

// =================================== Generating element css ===================================

const add_style = () => {
    let all_style = "";
    Array.from(style_panel.querySelectorAll("input")).map((input) => {
        let style_value = input.value;
        if (style_value != "") {
            let style_name = input.getAttribute("data-name");
            let this_style = style_name + ": " + style_value +input.parentElement.parentElement.getAttribute("data-unit") + ";";
            all_style += this_style;
        }
    });
    sel(1, "[data-active='true']").style.cssText = all_style;
}

// =================================== Generating Edit panel ===================================

const open_edit_panel = () => {
    sel(1, ".edit_panel").classList.remove("close_edit");
    let active_elem = sel(1, "[data-active='true']");
    let all_input = style_panel.querySelectorAll("input");
    for (let i = 0; i < all_input.length; i++) {
        all_input[i].value = "";
    }

    // ===================== Preparing the Content tab ====================
    sel(1, "[data-name='elemenet_name']").value = active_elem.getAttribute("data-name");
    sel(1, "[data-name='elemenet_class']").value = active_elem.getAttribute("class");
    sel(1, "[data-name='elemenet_id']").value = active_elem.getAttribute("id");

    if (active_elem.tagName == "P") {
        sel(1, "[data-name='text_content']").value = active_elem.innerText;
    }

    if (stylesheet.length > 0) {
        for (i in stylesheet) {
            if (stylesheet[i][0] == active_elem.getAttribute("data-id")) {
                let split_style = stylesheet[i][1].split(";");
                split_style.pop();
                for (i in split_style) {
                    let style_name = split_style[i].split(":")[0].toString();
                    let style_value = split_style[i].split(":")[1].toString();

                    for (let i = 0; i < all_input.length; i++) {
                        if (all_input[i].getAttribute("data-name") == style_name) {
                            all_input[i].value = parseInt(style_value);
                        }
                    }
                }
            }
        }
    }
}
sel(1, ".edit_opener").addEventListener("click", () => {
    if (sel(1, ".edit_panel").classList.contains("close_edit")) {
        delete_unnecessary();
        open_edit_panel();
    } else {
        sel(1, ".edit_panel").classList.add("close_edit");
    }
});
edit_panel.querySelectorAll("[data-heading]").forEach((item) => {
    item.addEventListener("click", () => {
        edit_panel.querySelectorAll("[data-heading]").forEach((item)=>item.classList.remove("active"));
        item.classList.add("active");
        edit_panel.querySelectorAll("[data-content]").forEach((item) => item.classList.add("display_none"));
        let content_temp = "[data-content='" + item.getAttribute("data-heading") + "']";
        edit_panel.querySelector(content_temp).classList.remove("display_none");
    })
})
sel(2, "[data-input-type]").forEach((item) => {
    item.addEventListener("click", () => {
        if (item.getAttribute("data-role" == "switch")) {
            if (item.parentElement.parentElement.getAttribute("data-unit") == "px") {
                item.parentElement.parentElement.setAttribute("data-unit", "em");
                item.innerHTML = "em";
            } else {
                item.parentElement.parentElement.setAttribute("data-unit", "px");
                item.innerHTML = "px";
            }
        }
    })
});
sel(2, "[data-name]").forEach((item) => {
    item.addEventListener("change", () => {
        add_style();
    })
})

// =================== Adding content to Elements ====================

const delete_unnecessary = () => {
    let active_elem = sel(1, "[data-active='true']");
    if (active_elem.tagName == "P") {
        content_panel.querySelectorAll("[data-input-type='text']").forEach((item) => item.classList.remove("display_none"));
    } else {
        content_panel.querySelectorAll("[data-input-type='text']").forEach((item) => item.classList.add("display_none"));
    }
}

let text_content = content_panel.querySelector("[data-name='text_content']");
text_content.addEventListener("keyup", () => {
    sel(1, "[data-active='true']").innerText = text_content.value;
});
text_content.addEventListener("blur", () => {
    sel(1, "[data-active='true']").innerText = text_content.value;
});

let element_name = content_panel.querySelector("[data-name='elemenet_name']");
element_name.addEventListener("keyup", () => {
    sel(1, "[data-active='true']").setAttribute("data-name", element_name.value);
    bread_builder(sel(1, "[data-active='true']"));
});
element_name.addEventListener("blur", () => {
    sel(1, "[data-active='true']").setAttribute("data-name", element_name.value);
    bread_builder(sel(1, "[data-active='true']"));
});
let elemenet_id = content_panel.querySelector("[data-name='elemenet_id']");
elemenet_id.addEventListener("keyup", () => {
    sel(1, "[data-active='true']").setAttribute("id", elemenet_id.value);
});
elemenet_id.addEventListener("blur", () => {
    sel(1, "[data-active='true']").setAttribute("id", elemenet_id.value);
});
let elemenet_class = content_panel.querySelector("[data-name='elemenet_class']");
elemenet_class.addEventListener("keyup", () => {
    sel(1, "[data-active='true']").classList = elemenet_class.value;
});
elemenet_class.addEventListener("blur", () => {
    sel(1, "[data-active='true']").classList = elemenet_class.value;
});





// Body panel



listener()



// ================================================================
// I am section
//  -- I go to page
// I am element
    // Page empty
        // -- Make row-column
        // -- Make section
    // else
        // Active elem is container
            // -- I place
        // Active elem is section
            // -- Make my row-column
            // loop
        // Active elem is element
            // Parent is container
                // -- I place in parent
            // Parent is section
                // -- Make row-column
                // loop
// I am container
    // Page empty
        // Make section
    // else
        // Active elem is element
            // -- Place me in parent
        // else
            // -- I place

// ================================================================
// Page empty
    // I am section
        // -- I place in page
    // I am container
        // -- Make section
    // else
        // -- Make row-column
        // -- Make section
// else
    // I am section
        // -- I place in page
    // I am container
        // Active elem is element
            // -- I place in parent
        // else
            // -- I place
    // I am element
        // Active elem is element
            // Parent is section
                // -- Make row-column
                // loop
            // Parent is container
                // -- I place in parent
        // Active elem is container
            // -- I place
        // else
            // -- Make row-column
            // loop

// ================================================================
// I am section
    // -- I place in page
// else
    // Page empty
        // I am element
            // -- Make row-column
        // Make section
    // else
        // Active elem is element
            // Parent is section
                // I am element
                    // -- Make row-column
                    // loop
                // else
                    // -- I place in parent
            // Parent is container
                // -- I place in parent
        // Active elem is container
            // -- I place
        // Active elem is section
            // I am container
                // -- I place
            // else
                // -- Make row-column
                // loop