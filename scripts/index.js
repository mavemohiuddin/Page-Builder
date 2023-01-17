// =================================== Generics Scripts ===================================

let valueset = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];

const sel = (type, name) => {
    if (type == 1) {
        return document.querySelector(name);
    } else {
        return document.querySelectorAll(name);
    }
}

const make = (name, data_name, id, cls, htm, child) => {
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
        ans.setAttribute("data-active", "false");
        ans.setAttribute("data-id", data_id());
    }
    ans.setAttribute("data-name", data_name);
    return ans;
}

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

    // =================================== Exporting HTML ===================================

    page_temp.innerHTML = page.innerHTML;
    page_temp.querySelectorAll("[data-active]").forEach((item) => item.removeAttribute("data-active"));
    page_temp.querySelectorAll("[data-name]").forEach((item) => item.removeAttribute("data-name"));
    page_temp.querySelectorAll("[style]").forEach((item) => item.removeAttribute("style"));
    let page_html = page_temp.innerHTML;
    sel(1, "#export_html").value = page_html;

    // =================================== Exporting CSS ===================================

    if (stylesheet.length > 0) {
        let export_style = "";
        for (i in stylesheet) {
            let class_name = stylesheet[i][0]
            let style_value = stylesheet[i][1];
            let compiled_style = "[data-id=" + class_name + "] {" + style_value + "}";
            export_style += compiled_style;
        }
        sel(1, "#export_css").value = export_style;
    } else {
        sel(1, "#export_css").value = "No CSS";
    }
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
            let bread_temp = make("p", "bread", 1, 1, bread_list[i], 1);
            bread_temp.setAttribute("data-destination", bread_target_list[i]);
            bread_temp.addEventListener("click", (event) => {
                selector(event.target.getAttribute("data-destination"));
            })
            bread.appendChild(bread_temp);
        }
        bread_list = [];
    } else {
        bread_list.push(me.getAttribute("data-name"));
        bread_target_list.push(me.getAttribute("data-id"))
        bread_builder(me.parentElement);
    }
}

const listener = () => {
    page.addEventListener("click", (event) => {
        selector(event.target.getAttribute("data-id"));
    })
}

// =================================== Generic Identifier ===================================

let elem_panel = sel(1, ".elem_panel");
let edit_panel = sel(1, ".edit_panel");
let style_panel = sel(1, "[data-content='styles']");
let content_panel = sel(1, "[data-content='content']");
let page = sel(1, ".page");
let page_temp = sel(1, ".page_temp");
let bread = sel(1, ".breadcrumb");

// =================================== Element panel ===================================

sel(2, "[data-heading]").forEach((item) => {
    item.addEventListener("click", (event)=> {
        let heading = item.getAttribute("data-heading");
        let content_temp = "[data-content='" + heading + "']"
        let content = sel(1, content_temp);

        if (event.target.parentElement.classList.contains("edit_panel")) {
            edit_panel.querySelectorAll("[data-content]").forEach((item) => item.classList.add("display_none"));
        }

        if (content.classList.contains("display_none")) {
            content.classList.remove("display_none");
        } else {
            content.classList.add("display_none");
        }
    })
});
sel(1, ".elem_opener").addEventListener("click", () => {
    if (sel(1, ".elem_panel").classList.contains("close_elem")) {
        sel(1, ".elem_panel").classList.remove("close_elem");
    } else {
        sel(1, ".elem_panel").classList.add("close_elem");
    }
})

elem_panel.querySelectorAll("[data-element]").forEach((item) => {
    item.addEventListener("click", () => {
        type_opener(item.getAttribute("data-element"));
    })
})
const type_opener = (code_name) => {
    item_spawn(code_name);
}
const item_spawn = (item_name) => {
    let active_elem = sel(1, "[data-active=true");
    if (item_name == "div") {
        let new_item = make("div", "Section", 1, 1, 1, 1);
        active_elem.appendChild(new_item);
        selector(new_item.getAttribute("data-id"))
    } else if (item_name == "p") {
        let new_item = make("p", "Paragraph", 1, 1, 1, 1);
        active_elem.appendChild(new_item);
        selector(new_item.getAttribute("data-id"))
    }
}




// =================================== Edit panel ===================================

// =================================== Generating element css ===================================
let stylesheet = [];

const stylesheet_adder = (name, style) => {
    let set = [name, style];
    let changed = 0;

    if (stylesheet.length == 0) {
        stylesheet.push(set);
    } else {
        for (i in stylesheet) {
            if (changed == 0) {
                if (stylesheet[i][0] == name) {
                    stylesheet.splice(i , 1, set);
                    changed = 1;
                }
            }
        }
        if (changed == 0) {
            stylesheet.push(set);
        }
    }
}

// ================================= Adding styles to Elements for displaying =================================

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
    stylesheet_adder(sel(1, "[data-active='true']").getAttribute("data-id"), all_style);
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
sel(2, "[data-type]").forEach((item) => {
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
text_content.addEventListener("change", () => {
    sel(1, "[data-active='true']").innerText = text_content.value;
});
text_content.addEventListener("blur", () => {
    sel(1, "[data-active='true']").innerText = text_content.value;
});

let element_name = content_panel.querySelector("[data-name='elemenet_name']");
element_name.addEventListener("blur", () => {
    sel(1, "[data-active='true']").setAttribute("data-name", element_name.value);
    bread_builder(sel(1, "[data-active='true']"));
});





// Body panel



listener()