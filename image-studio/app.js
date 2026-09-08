const $ = (id) => document.getElementById(id);
const promptBox = $("prompt");
const generateBtn = $("generate");
const result = $("result");
const stage = $("stage");
const empty = $("empty");
const loading = $("loading");
const error = $("error");
const download = $("download");
const clear = $("clear");
const status = $("status");
const sizeMap = { square:{w:1,h:1}, landscape:{w:3,h:2}, portrait:{w:2,h:3} };
document.querySelectorAll(".chips button").forEach(button=>button.addEventListener("click",()=>{promptBox.value=button.dataset.prompt||"";promptBox.focus()}));
function showError(message){error.textContent=message;error.hidden=false}
function setBusy(busy){generateBtn.disabled=busy;if(busy){error.hidden=true;empty.hidden=true;result.hidden=true;loading.hidden=false;download.disabled=true;stage.classList.remove("empty");status.textContent="Generating…"}else generateBtn.disabled=false}
async function generate(){const prompt=promptBox.value.trim();if(!prompt){showError("Describe what you want to create first.");promptBox.focus();return}setBusy(true);try{if(!window.puter||!puter.ai||typeof puter.ai.txt2img!=="function")throw new Error("The image service did not load. Refresh the page and try again.");const image=await puter.ai.txt2img(prompt,{model:"gpt-image-2",quality:$("quality").value,ratio:sizeMap[$("size").value]||sizeMap.square});if(!image||!image.src)throw new Error("The image service returned no image. Please try again.");result.src=image.src;result.hidden=false;loading.hidden=true;download.disabled=false;status.textContent="Done"}catch(err){loading.hidden=true;empty.hidden=false;stage.classList.add("empty");status.textContent="Ready";showError(err?.message||"Image generation failed. Please try again.")}finally{generateBtn.disabled=false}}
function reset(){promptBox.value="";result.removeAttribute("src");result.hidden=true;loading.hidden=true;empty.hidden=false;error.hidden=true;download.disabled=true;stage.classList.add("empty");status.textContent="Ready";promptBox.focus()}
generateBtn.addEventListener("click",generate);clear.addEventListener("click",reset);promptBox.addEventListener("keydown",event=>{if((event.metaKey||event.ctrlKey)&&event.key==="Enter")generate()});download.addEventListener("click",()=>{if(!result.src)return;const link=document.createElement("a");link.href=result.src;link.download="starlife-image.png";document.body.appendChild(link);link.click();link.remove()});
