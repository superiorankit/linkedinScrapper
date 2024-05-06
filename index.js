const puppeteer = require('puppeteer');


const start= async ()=>{

//     const context = await browser.createIncognitoBrowserContext();
// const page = await context.newPage();

    const browser = await puppeteer.launch({
        headless:false
    });
    const page = await browser.newPage();

    await page.goto('https://www.linkedin.com/home', { waitUntil: 'networkidle0' });

    await page.setViewport({width: 1280, height: 1024});

    await page.type('#session_key','hagofor1@gmail.com');
    await page.type('#session_password','@7004741510Ank')

    await page.click('button[type=submit]')

    await page.waitForNavigation();

    await page.waitForSelector('.search-global-typeahead__input')

    await page.type('.search-global-typeahead__input','education')
    await page.keyboard.press('Enter')

    await page.waitForNavigation();

        await page.waitForSelector('#search-reusables__filters-bar')

        const nav = await page.$('#search-reusables__filters-bar')

        const buttons = await nav.$$('button')

        buttons.forEach(async (button)=>{
            const text = await page.evaluate(element => element.textContent.trim(),button)
            if(text === "Companies")
            button.click();
        })

        await page.waitForSelector('#searchFilter_companyHqGeo')
        const location = await page.$('#searchFilter_companyHqGeo')
        location.click();
        await page.waitForSelector("input[placeholder='Add a location']")
        let input = await page.$("input[placeholder='Add a location']")

         await input.click();
         await input.type('indonesia',{delay: 500})

        let id = await page.evaluate((element)=>element.getAttribute('aria-controls'),input)
        
         await page.waitForSelector(`#${id}`)
        let locationDiv = await page.$(`#${id}`);

         await page.waitForSelector('span span')

        let li = await locationDiv.$$('span span');
                 
          li[0].click();

          let button = await page.$$('.reusable-search-filters-buttons .artdeco-button')
          button[1].click();

// --------------------------------------------------------------------------------------------------------------

          await page.waitForNavigation();

          await page.waitForSelector('#searchFilter_industryCompanyVertical')

          const industry = await page.$('#searchFilter_industryCompanyVertical')
          industry.click();
          await page.waitForSelector("input[placeholder='Add an industry']")
            input = await page.$("input[placeholder='Add an industry']")
  
           await input.click();
           await input.type('education',{delay: 500})
  
            id = await page.evaluate((element)=>element.getAttribute('aria-controls'),input)
          
           await page.waitForSelector(`#${id}`)
            locationDiv = await page.$(`#${id}`);
  
           await page.waitForSelector('span span')
  
            li = await locationDiv.$$('span span');    

            li.forEach(async (el)=>{
                let text = await page.evaluate((e)=>e.innerText,el)
                if(text.toLowerCase() === "education")
                {
                    el.click();
                    return;
                }
            })

            
          button = await page.$$('.reusable-search-filters-buttons .artdeco-button')
          button[3].click();

// --------------------------------------------------------------------------------------------------------------

await page.waitForNavigation();

await page.waitForSelector('#searchFilter_companySize')
const size = await page.$('#searchFilter_companySize')
size.click();


const sizeLi = await page.$('#companySize-C');

await sizeLi.click();

  
button = await page.$$('.reusable-search-filters-buttons .artdeco-button')
button[5].click();

//------------------------------------------------------------------------------------------------------------------


let companyCount = 0;
const obj = [];
const search = async () => {



          await page.waitForSelector(".entity-result__title-text .app-aware-link")
            //  const name = await page.$$eval(".entity-result__title-text .app-aware-link",(elements)=>elements.map((element)=> element.href))
            const list = await page.$$(".entity-result__title-text .app-aware-link")
            const length = list.length;
            for(let i=0;i<length;i++)
            {
              const a = list[i];
              const link = await page.evaluate(el => el.href.trim(),a)
              const Aboutpage = await browser.newPage();

              try{
      
                let singleObj = {
                }
             
              // Navigate the page to a URL
              const url = `${link}about`;
               await Aboutpage.goto(url);

               await Aboutpage.waitForSelector(".ph5 .mt2 h1")
               const name = await Aboutpage.evaluate(()=> document.querySelector(".ph5 .mt2 h1").innerHTML.trim());
               singleObj.name = name;
      
               await Aboutpage.waitForSelector("dl dt")
               const keyList = await Aboutpage.$$('dl dt')
               for(let i=0;i<keyList.length;i++)
               {
                  let key = await Aboutpage.evaluate((val)=>val.innerText,keyList[i]);

                  let val = await Aboutpage.evaluate((val)=>val.nextElementSibling.innerText,keyList[i]);

                  singleObj[key]=val;
               }
                  
               obj.push(singleObj);
               companyCount++;
               if(companyCount === 25) return;
              //  console.log(obj);
               await Aboutpage.close();
              }
              catch(err){
      
                console.log(" ")
                console.log(link)
                console.log(err)
              //   singleSearch(link);
              }
            }

 
};


while(true)
{
  try{
    await page.waitForNavigation();
  await search();
  const next = await page.waitForSelector('button[aria-label="Next"]');
  const disabled = await page.evaluate((tag)=>tag.disabled,next)
  if(companyCount === 25 || disabled) break;
  await next.click();

  }
  catch(err){
    console.log(err);
    // break;
  }
}

// console.log(obj)


const XLSX = require('xlsx');

// Convert the data to a worksheet
const ws = XLSX.utils.json_to_sheet(obj);

// Create a workbook and add the worksheet
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

// Write the workbook to a file
XLSX.writeFile(wb, 'data.xlsx', { bookType: 'xlsx' });


console.log("done")







 
// search();




}






start();

