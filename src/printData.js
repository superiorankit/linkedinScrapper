const puppeteer = require('puppeteer')



const obj = [];

const search = async () => {
  // Launch the browser and open a new blank page

  const browser1 = await puppeteer.launch();
const singleSearch = async (link)=>{ 

  try{

    let singleObj = {
    }


  const page = await browser1.newPage();
 
  await page.setCookie({name: 'li_at', value: 'AQEDAU4WOyACrqPeAAABjy0rRZEAAAGPUTfJkVYAqVa6ySEbOcqkVAV89Fj9RWDFCZMiL89hl5CLro3W1JNu8AwGkxIuu1s6r1VsU1B4PAaixXxjeWEjTgCla9vY1rpRhnz0ETi3uGQASHh78i5XrQ4L', domain: 'www.linkedin.com'})
  // Navigate the page to a URL
   await page.goto(`${link}/about`);



   const name = await page.evaluate(()=> document.querySelector(".ph5 .mt2 h1").innerHTML.trim());
  //  const website = await page.evaluate(()=> document.querySelector("dl dd:nth-child(2) a").href);

   const website = await page.$$eval("dl dd:nth-child(2) a",(elements)=>elements.map((element)=> element.href))
   const employees = await page.$$eval("dl dd:nth-child(6)",(elements)=>elements.map((element)=> element.innerHTML))

//    console.log(name);
//    console.log(website[0])
// console.log(employees[0].trim())

   singleObj.name = name;
   singleObj.website = website[0];
   singleObj.employees = employees[0].trim();


   obj.push(singleObj);
   console.log(obj);
  }
  catch(err){
    singleSearch(link);
  }

}
const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setCookie({name: 'li_at', value: 'AQEDAU4WOyACrqPeAAABjy0rRZEAAAGPUTfJkVYAqVa6ySEbOcqkVAV89Fj9RWDFCZMiL89hl5CLro3W1JNu8AwGkxIuu1s6r1VsU1B4PAaixXxjeWEjTgCla9vY1rpRhnz0ETi3uGQASHh78i5XrQ4L', domain: 'www.linkedin.com'})
// Navigate the page to a URL
 await page.goto('https://www.linkedin.com/search/results/companies/?companyHqGeo=%5B%22100459316%22%5D&companySize=%5B%22C%22%5D&industryCompanyVertical=%5B%221999%22%5D&keywords=education&origin=FACETED_SEARCH&sid=.UO');
 
             const name = await page.$$eval(".entity-result__title-text .app-aware-link",(elements)=>elements.map((element)=> element.href))
 
              name.forEach(async (el)=>{
                console.log(el.trim());
                await singleSearch(el.trim());
             })
};
 
search();