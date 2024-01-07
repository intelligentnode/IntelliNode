const { Gen } = require("../../function/Gen");
require("dotenv").config();
const assert = require("assert");
const fs = require('fs');

const openaiApiKey = process.env.OPENAI_API_KEY;
const stabilityApiKey = process.env.STABILITY_API_KEY;
const googleApiKey = process.env.GOOGLE_API_KEY;

async function testGetMarketingDesc() {
  const prompt = "gaming chair.";
  const marketingDesc = await Gen.get_marketing_desc(prompt, openaiApiKey);
  // console.log("Marketing Description:", marketingDesc);
  assert(marketingDesc.length > 0, "Test passed");
}

async function testGetBlogPost() {
  const prompt = "AI in art blog post.";
  const blogPost = await Gen.get_blog_post(prompt, openaiApiKey);
  // console.log("Blog Post:", blogPost);
  assert(blogPost.length > 0, "Test passed");
}

async function testGenerateImageFromDesc() {
  const prompt = "Generate an image of a futuristic city skyline.";
  const image = await Gen.generate_image_from_desc(prompt, openaiApiKey, stabilityApiKey, true);
  // console.log("Generated Image (Base64):", image);
  assert(image.length > 0, "Test passed");
}

async function testGenerateSpeechSynthesis() {
  const text = "IntelliNode is a powerful library to integrate AI models into your project.";
  const speech = await Gen.generate_speech_synthesis(text, googleApiKey);
  // console.log("Generated Speech (Base64):", speech);
  assert(speech.length > 0, "Test passed");
}


async function testGenerateHtmlPage() {
  const tempDir = '../temp';
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  const text = "a registration page with flat modern theme.";
  const htmlCode = await Gen.generate_html_page(text, openaiApiKey);

  fs.writeFileSync(`${tempDir}/generated_page_test.html`, htmlCode["html"]);

  assert(htmlCode["html"].length > 0, "Test passed");
}

async function testSaveHTML() {
  prompt = "a registration page with flat modern theme."
  result = await Gen.save_html_page(prompt, folder='../temp', file_name='test_register', openaiKey=openaiApiKey);
  assert.strictEqual(result, true, "Test passed");
}

async function testGenerateDashboard() {
  const tempDir = '../temp';
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  const csv_str_data = 'Title:,Monthly Hospital Activity,,,,,,,,,,,,,,,,,,,  ,Summary:,Monthly activity data relating to elective and non-elective inpatient admissions (FFCEs) and outpatient referrals and attendances for first consultant outpatient appointments.,,,,,,,,,,,,,,,,,,,  ,,,,,,,,,,,,,,,,,,,,,  ,Period:,May 2020,,,,,,,,,,,,,,,,,,,  ,Source:,"Monthly Activity Return, NHS England and NHS Improvement, collected via SDCS",,,,,,,,,,,,,,,,,,,  ,Basis:,Commissioner,,,,,,,,,,,,,,,,,,,  ,Published:,9th July 2020,,,,,,,,,,,,,,,,,,,  ,Revised:,-,,,,,,,,,,,,,,,,,,,  ,Status:,Public,,,,,,,,,,,,,,,,,,,  ,Contact:,england.nhsdata@nhs.net,,,,,,,,,,,,,,,,,,,  ,,,,,,,,,,,,,,,,,,,,,  ,Commissioner Level Data,,,,,,,,,,,,,,,,,,,,  ,Year,Period,Region Code,Region Name,Org Code,Org Name,Elective G&A Ordinary Admissions (FFCEs),Elective G&A Daycase Admissions (FFCEs),Elective G&A Total Admissions (FFCEs),Elective G&A Planned Ordinary Admissions (FFCEs),Elective G&A Planned Daycase Admissions (FFCEs),Elective G&A Planned Total Admissions (FFCEs),Elective G&A Admissions (FFCEs) -NHS Treatment Centres (TCs) ,Total Non-elective G&A Admissions (FFCEs),GP Referrals Made (All specialties) ,GP Referrals Seen (All specialties) ,GP Referrals Made (G&A) ,GP Referrals Seen (G&A) ,Other Referrals Made (G&A) ,All 1st Outpatient Attendances (G&A) ,  ,2020-21,May,,,,England,"12,455","67,118","79,573","3,166","33,751","36,917",426,"120,181","119,045","134,058","111,307","127,895","119,767","276,933",  ,,,,,,,,,,,,,,,,,,,,,  ,2020-21,May,-,NHS ENGLAND,X24,NHS ENGLAND," 	5,166 "," 	21,901 "," 	27,067 "," 	1,296 "," 	14,067 "," 	15,363 ", 	107 ," 	12,178 "," 	10,693 "," 	19,347 "," 	10,523 "," 	19,055 "," 	20,410 "," 	67,546 ",  ,2020-21,May,Y56,LONDON COMMISSIONING REGION,07L,NHS BARKING AND DAGENHAM CCG, 	58 , 	314 , 	372 , 	8 , 	130 , 	138 , 	-   ," 	1,469 "," 	1,516 ", 	866 ," 	1,291 ", 	727 ," 	1,608 "," 	1,867 ",  ,2020-21,May,Y56,LONDON COMMISSIONING REGION,07P,NHS BRENT CCG, 	110 , 	998 ," 	1,108 ", 	46 , 	708 , 	754 , 	30 ," 	1,956 "," 	2,214 "," 	2,536 "," 	2,086 "," 	2,419 "," 	2,627 "," 	4,609 ",  ,2020-21,May,Y56,LONDON COMMISSIONING REGION,07T,NHS CITY AND HACKNEY CCG, 	62 , 	409 , 	471 , 	29 , 	162 , 	191 , 	-   ," 	1,521 "," 	1,508 "," 	1,347 "," 	1,302 "," 	1,189 "," 	2,283 "," 	2,982 ",  ,2020-21,May,Y56,LONDON COMMISSIONING REGION,07W,NHS EALING CCG, 	117 ," 	1,056 "," 	1,173 ", 	50 , 	706 , 	756 , 	51 ," 	2,429 "," 	2,041 "," 	2,688 "," 	1,900 "," 	2,545 "," 	2,822 "," 	5,566 ",  ,2020-21,May,Y56,LONDON COMMISSIONING REGION,07Y,NHS HOUNSLOW CCG, 	61 , 	608 , 	669 , 	20 , 	374 , 	394 , 	1 ," 	1,662 "," 	1,361 "," 	2,212 "," 	1,213 "," 	2,039 "," 	1,907 "," 	4,441 ",  ,2020-21,May,Y56,LONDON COMMISSIONING REGION,08C,NHS HAMMERSMITH AND FULHAM CCG, 	66 , 	543 , 	609 , 	20 , 	323 , 	343 , 	3 ," 	1,134 "," 	1,762 "," 	2,798 "," 	1,615 "," 	2,642 "," 	1,723 "," 	4,911 ",  ,2020-21,May,Y56,LONDON COMMISSIONING REGION,08E,NHS HARROW CCG, 	80 , 	687 , 	767 , 	27 , 	427 , 	454 , 	41 ," 	1,643 "," 	1,340 "," 	1,632 "," 	1,326 "," 	1,606 "," 	1,853 "," 	3,134 ",  ,2020-21,May,Y56,LONDON COMMISSIONING REGION,08F,NHS HAVERING CCG, 	99 , 	519 , 	618 , 	11 , 	177 , 	188 , 	-   ," 	2,108 "," 	2,212 "," 	1,164 "," 	1,948 ", 	990 ," 	2,213 "," 	2,309 ",  ,2020-21,May,Y56,LONDON COMMISSIONING REGION,08G,NHS HILLINGDON CCG, 	73 , 	769 , 	842 , 	18 , 	402 , 	420 , 	70 ," 	1,539 "," 	1,494 "," 	1,632 "," 	1,469 "," 	1,598 "," 	1,708 "," 	3,420 ",  ,2020-21,May,Y56,LONDON COMMISSIONING REGION,08M,NHS NEWHAM CCG, 	63 , 	321 , 	384 , 	12 , 	150 , 	162 , 	1 ," 	2,168 "," 	1,424 "," 	2,094 "," 	1,150 "," 	1,813 "," 	2,144 "," 	3,636 ",  ,2020-21,May,Y56,LONDON COMMISSIONING REGION,08N,NHS REDBRIDGE CCG, 	75 , 	383 , 	458 , 	16 , 	125 , 	141 , 	1 ," 	1,804 "," 	2,089 "," 	1,464 "," 	1,631 "," 	1,269 "," 	1,921 "," 	2,594 ",  ,2020-21,May,Y56,LONDON COMMISSIONING REGION,08V,NHS TOWER HAMLETS CCG, 	45 , 	323 , 	368 , 	16 , 	161 , 	177 , 	-   ," 	1,589 "," 	1,373 "," 	1,607 "," 	1,218 "," 	1,467 "," 	1,395 "," 	2,731 ",  ,2020-21,May,Y56,LONDON COMMISSIONING REGION,08W,NHS WALTHAM FOREST CCG, 	69 , 	328 , 	397 , 	24 , 	129 , 	153 , 	-   ," 	1,776 "," 	1,823 "," 	1,982 "," 	1,433 "," 	1,778 "," 	1,936 "," 	3,546 ",  ,2020-21,May,Y56,LONDON COMMISSIONING REGION,08Y,NHS WEST LONDON CCG, 	64 , 	479 , 	543 , 	19 , 	299 , 	318 , 	3 ," 	1,027 "," 	1,168 "," 	2,382 "," 	1,091 "," 	2,255 "," 	1,481 "," 	4,358 ",  ,2020-21,May,Y56,LONDON COMMISSIONING REGION,09A,NHS CENTRAL LONDON (WESTMINSTER) CCG, 	56 , 	447 , 	503 , 	18 , 	243 , 	261 , 	-   , 	813 , 	933 ," 	1,531 ", 	870 ," 	1,468 "," 	1,228 "," 	2,907 ",  ,2020-21,May,Y56,LONDON COMMISSIONING REGION,36L,NHS SOUTH WEST LONDON CCG, 	422 ," 	2,395 "," 	2,817 ", 	89 , 	789 , 	878 , 	1 ," 	8,867 "," 	11,310 "," 	13,313 "," 	10,148 "," 	12,547 "," 	9,297 "," 	24,352 ",  ,2020-21,May,Y56,LONDON COMMISSIONING REGION,72Q,NHS SOUTH EAST LONDON CCG," 	1,049 "," 	4,714 "," 	5,763 ", 	219 ," 	1,645 "," 	1,864 ", 	3 ," 	11,660 "," 	12,163 "," 	12,945 "," 	11,810 "," 	12,276 "," 	11,344 "," 	25,140 ",  ,2020-21,May,Y56,LONDON COMMISSIONING REGION,93C,NHS NORTH CENTRAL LONDON CCG, 	404 ," 	4,374 "," 	4,778 ", 	116 ," 	2,358 "," 	2,474 ", 	1 ," 	7,699 "," 	8,257 "," 	9,320 "," 	8,141 "," 	9,215 "," 	11,217 "," 	20,699 ",  ,2020-21,May,Y58,SOUTH WEST COMMISSIONING REGION,11J,NHS DORSET CCG, 	508 ," 	2,921 "," 	3,429 ", 	178 ," 	1,444 ","1,622 ", 	-   ," 	5,864 "," 	6,872 "," 	4,333 "," 	6,860 "," 	4,309 "," 	4,050 "," 	8,084 ",  ,2020-21,May,Y58,SOUTH WEST COMMISSIONING REGION,11M,NHS GLOUCESTERSHIRE CCG, 	333 ," 	1,542 "," 	1,875 ", 	101 , 	812 , 	913 , 	2 ," 	3,897 "," 	4,056 "," 	3,462 "," 	4,010 "," 	3,410 "," 	3,182 "," 	5,449 ",  ,2020-21,May,Y58,SOUTH WEST COMMISSIONING REGION,11N,NHS KERNOW CCG, 	520 ," 	2,889 "," 	3,409 ", 	197 ," 	1,311 ","1,508 ", 	-   ," 	3,907 "," 	4,641 "," 	4,739 "," 	4,592 "," 	4,687 "," 	1,909 "," 	7,864 ",  ,2020-21,May,Y58,SOUTH WEST COMMISSIONING REGION,11X,NHS SOMERSET CCG, 	293 ," 	1,760 "," 	2,053 ", 	55 , 	732 , 	787 , 	-   ," 	4,435 "," 	3,325 "," 	2,942 "," 	3,313 "," 	2,931 "," 	2,266 "," 	5,355 ",  ,2020-21,May,Y58,SOUTH WEST COMMISSIONING REGION,15C,"NHS BRISTOL, NORTH SOMERSET AND SOUTH GLOUCESTERSHIRE CCG", 	422 ," 	2,926 "," 	3,348 ", 	106 , 	703 , 	809 , 	-   ," 	7,099 "," 	4,126 "," 	4,963 "," 	4,067 "," 	4,859 "," 	5,671 "," 	8,325 ",  ,2020-21,May,Y58,SOUTH WEST COMMISSIONING REGION,15N,NHS DEVON CCG," 	1,122 "," 	5,491 "," 	6,613 ", 	289 ," 	2,425 "," 	2,714 ", 	-   ," 	9,347 "," 	8,510 "," 	9,310 "," 	8,509 "," 	9,046 "," 	5,312 ","15,890 ",  ,2020-21,May,Y58,SOUTH WEST COMMISSIONING REGION,92G,"NHS BATH AND NORTH EAST SOMERSET, SWINDON AND WILTSHIRE CCG", 	347 ," 	3,034 "," 	3,381 ", 	58 ," 	1,335 "," 	1,393 ", 	-   ," 	6,458 "," 	6,376 "," 	5,212 "," 	5,259 "," 	5,114 "," 	5,808 "," 	9,623 ",  ,2020-21,May,Y59,SOUTH EAST COMMISSIONING REGION,09D,NHS BRIGHTON AND HOVE CCG, 	145 , 	724 , 	869 , 	27 , 	315 , 	342 , 	-   ," 	1,870 "," 	1,793 "," 	1,900 "," 	1,623 "," 	1,709 "," 	1,790 "," 	3,000 ",  ,2020-21,May,Y59,SOUTH EAST COMMISSIONING REGION,10C,NHS SURREY HEATH CCG, 	31 , 	185 , 	216 , 	1 , 	21 , 	22 , 	8 , 	563 , 	691 , 	515 , 	689 , 	509 , 	521 , 	961 ,  ,2020-21,May,Y59,SOUTH EAST COMMISSIONING REGION,10J,NHS NORTH HAMPSHIRE CCG, 	87 , 	571 , 	658 , 	16 , 	278 , 	294 , 	66 ," 	1,512 "," 	1,285 "," 	1,966 "," 	1,283 "," 	1,956 ", 	807 ," 	3,361 ",  ,2020-21,May,Y59,SOUTH EAST COMMISSIONING REGION,10K,NHS FAREHAM AND GOSPORT CCG, 	97 , 	613 , 	710 , 	25 , 	242 , 	267 , 	-   ," 	1,463 ", 	995 ," 	1,264 ", 	714 ," 	1,065 "," 	1,142 "," 	2,183 ",  ,2020-21,May,Y59,SOUTH EAST COMMISSIONING REGION,10L,NHS ISLE OF WIGHT CCG, 	72 , 	211 , 	283 , 	11 , 	87 , 	98 , 	-   ," 	1,145 ", 	558 , 	705 , 	554 , 	702 , 	924 ," 	1,663 ",  ,2020-21,May,Y59,SOUTH EAST COMMISSIONING REGION,10Q,NHS OXFORDSHIRE CCG, 	123 ," 	1,413 "," 	1,536 ", 	7 , 	179 , 	186 , 	35 ," 	4,504 "," 	6,859 "," 	7,059 "," 	5,952 "," 	6,251 "," 	3,091 "," 	9,725 ",  ,2020-21,May,Y59,SOUTH EAST COMMISSIONING REGION,10R,NHS PORTSMOUTH CCG, 	107 , 	597 , 	704 , 	23 , 	244 , 	267 , 	-   ," 	1,478 "," 	1,136 "," 	1,373 ", 	799 ," 	1,136 "," 	1,071 "," 	2,131 ",  ,2020-21,May,Y59,SOUTH EAST COMMISSIONING REGION,10V,NHS SOUTH EASTERN HAMPSHIRE CCG, 	109 , 	673 , 	782 , 	18 , 	248 , 	266 , 	2 ," 	1,597 "," 	1,141 "," 	1,455 ", 	918 ," 	1,313 "," 	1,106 "," 	2,571 ",  ,,,,,,,,,,,,,,,,,,,,,  ,Note: Excludes non-English commissioned activity and includes all providers who have submitted data.,,,,,,,,,,,,,,,,,,,,';
  const topic = "Monthly Hospital Activity";
  const htmlCode = await Gen.generate_dashboard(csv_str_data, topic, openaiKey=openaiApiKey,
                                                    model_name='gpt-4', num_graphs=2);

  fs.writeFileSync(`${tempDir}/generated_dashboard_test.html`, htmlCode["html"]);

  assert(htmlCode["html"].length > 0, "Test passed");
}


async function testInstructUpdate() {
  const modelOutput = "{\"html\": \"<!DOCTYPE html><html><body><h1>Title1</h1></";
  const userInstruction = "fix the format";
  const type = "json with html content"

  const fixedOutput = await Gen.instructUpdate(modelOutput, userInstruction, type, openaiApiKey);

  assert(fixedOutput.length > 0, "Test passed");
}

(async () => {
  console.log('test the marketing function');
  await testGetMarketingDesc();
  console.log('test blog post function');
  await testGetBlogPost();
  console.log('test image description function');
  await testGenerateImageFromDesc();
  console.log('test speech function');
  await testGenerateSpeechSynthesis();
  console.log('test generate html function');
  await testGenerateHtmlPage();
  console.log('test save html function');
  await testSaveHTML();
  console.log('test the dashboard function');
  await testGenerateDashboard();
  console.log('test the instruct function');
  await testInstructUpdate();
})();