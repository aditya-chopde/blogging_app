import fs from 'fs'
import path from 'path'

// Pure Node.js standard PDF generator (PDF-1.4)
class SimplePdfWriter {
  constructor() {
    this.objects = []
    this.pages = []
    this.currentPageContent = []
    this.fontObjId = 0
    this.fontBoldObjId = 0
  }

  addObject(content) {
    const id = this.objects.length + 1
    this.objects.push({ id, content })
    return id
  }

  startPage() {
    this.currentPageContent = []
  }

  addText(text, x, y, size = 12, bold = false, r = 0.18, g = 0.15, b = 0.1) {
    // Escape parentheses and backslashes in PDF strings
    const safeText = text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')
    const fontName = bold ? '/F2' : '/F1'
    this.currentPageContent.push(
      `BT ${r.toFixed(2)} ${g.toFixed(2)} ${b.toFixed(2)} rg ${fontName} ${size} Tf ${x} ${y} Td (${safeText}) Tj ET`
    )
  }

  addRect(x, y, w, h, r = 0.95, g = 0.93, b = 0.88, fill = true, stroke = false) {
    let cmd = `${x} ${y} ${w} ${h} re `
    if (fill && stroke) {
      cmd += `${r.toFixed(2)} ${g.toFixed(2)} ${b.toFixed(2)} rg 0 0 0 RG B`
    } else if (fill) {
      cmd += `${r.toFixed(2)} ${g.toFixed(2)} ${b.toFixed(2)} rg f`
    } else {
      cmd += `${r.toFixed(2)} ${g.toFixed(2)} ${b.toFixed(2)} RG S`
    }
    this.currentPageContent.push(cmd)
  }

  addLine(x1, y1, x2, y2, r = 0.8, g = 0.8, b = 0.8, lineWidth = 1) {
    this.currentPageContent.push(
      `${lineWidth} w ${r.toFixed(2)} ${g.toFixed(2)} ${b.toFixed(2)} RG ${x1} ${y1} m ${x2} ${y2} l S`
    )
  }

  endPage() {
    const streamData = this.currentPageContent.join('\n')
    const streamLen = Buffer.byteLength(streamData, 'utf-8')
    const streamObjId = this.addObject(`<< /Length ${streamLen} >>\nstream\n${streamData}\nendstream`)
    this.pages.push(streamObjId)
  }

  build() {
    // Font objects
    const fontRegularId = this.addObject(
      `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>`
    )
    const fontBoldId = this.addObject(
      `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>`
    )

    // Reserve ID for pagesObjId
    const pagesObjId = this.objects.length + this.pages.length + 1
    const pageObjIds = []

    for (const contentStreamId of this.pages) {
      const pageId = this.addObject(
        `<< /Type /Page /Parent ${pagesObjId} 0 R /MediaBox [0 0 595.28 841.89] /Contents ${contentStreamId} 0 R /Resources << /Font << /F1 ${fontRegularId} 0 R /F2 ${fontBoldId} 0 R >> >> >>`
      )
      pageObjIds.push(pageId)
    }

    // Now insert the actual Pages root object
    this.addObject(
      `<< /Type /Pages /Kids [${pageObjIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pageObjIds.length} >>`
    )

    // Catalog object
    const catalogObjId = this.addObject(`<< /Type /Catalog /Pages ${pagesObjId} 0 R >>`)

    // Info object
    const infoObjId = this.addObject(
      `<< /Title (10 Healthy High-Protein Recipes) /Author (Healthy Worm) /Subject (Nutritious High-Protein Meal Guide) /Creator (Healthy Worm Publishing) >>`
    )

    // Assemble PDF buffer
    let output = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n'
    const xrefOffsets = [0] // object 0 offset

    for (const obj of this.objects) {
      xrefOffsets[obj.id] = Buffer.byteLength(output, 'utf-8')
      output += `${obj.id} 0 obj\n${obj.content}\nendobj\n`
    }

    const xrefOffset = Buffer.byteLength(output, 'utf-8')
    output += `xref\n0 ${this.objects.length + 1}\n0000000000 65535 f \n`

    for (let i = 1; i <= this.objects.length; i++) {
      const offsetStr = String(xrefOffsets[i]).padStart(10, '0')
      output += `${offsetStr} 00000 n \n`
    }

    output += `trailer\n<< /Size ${this.objects.length + 1} /Root ${catalogObjId} 0 R /Info ${infoObjId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`

    return Buffer.from(output, 'utf-8')
  }
}

// Recipes Data
const recipes = [
  {
    title: '1. Greek Lemon Herb Chicken & Quinoa Bowl',
    category: 'Lunch & Dinner',
    time: '25 mins | 2 Servings',
    macros: 'Calories: 480 | Protein: 42g | Carbs: 38g | Fat: 14g',
    ingredients: [
      '2 skinless chicken breasts (approx 350g total), diced',
      '1 cup cooked fluffy tri-color quinoa',
      '1 cup sliced English cucumbers & halved cherry tomatoes',
      '1/4 cup crumbled Greek feta cheese',
      '2 tbsp kalamata olives, pitted & sliced',
      'Dressing: 1 tbsp extra virgin olive oil, 1 tbsp lemon juice, oregano, garlic salt',
    ],
    instructions: [
      '1. Heat 1 tsp olive oil in a skillet over medium-high heat. Season chicken with salt, oregano, and black pepper.',
      '2. Sear chicken for 6-8 minutes until golden and internal temperature reaches 165 F (74 C).',
      '3. Assemble bowls with cooked quinoa as the base, followed by cucumber, tomatoes, and warm seared chicken.',
      '4. Top with crumbled feta, kalamata olives, and drizzle with fresh lemon-herb vinaigrette.',
    ],
  },
  {
    title: '2. High-Protein Strawberry Chia Overnight Oats',
    category: 'Breakfast / Prep-Ahead',
    time: '5 mins prep + chill | 1 Serving',
    macros: 'Calories: 390 | Protein: 34g | Carbs: 42g | Fat: 9g',
    ingredients: [
      '1/2 cup rolled oats (certified gluten-free if needed)',
      '1 scoop (30g) vanilla whey or plant-based protein powder',
      '1 tbsp chia seeds',
      '1/2 cup plain Greek yogurt (0% or 2%)',
      '1/2 cup unsweetened almond or oat milk',
      '1/2 cup fresh diced strawberries + 1 tsp pure maple syrup',
    ],
    instructions: [
      '1. In a mason jar, whisk protein powder, milk, and Greek yogurt until completely smooth without clumps.',
      '2. Fold in rolled oats, chia seeds, and half the fresh strawberries.',
      '3. Seal tightly and refrigerate for at least 4 hours or overnight.',
      '4. In the morning, top with remaining fresh strawberries and a dash of cinnamon before serving chilled.',
    ],
  },
  {
    title: '3. Sesame Ginger Pan-Seared Salmon & Edamame',
    category: 'Dinner',
    time: '20 mins | 2 Servings',
    macros: 'Calories: 510 | Protein: 38g | Carbs: 32g | Fat: 22g',
    ingredients: [
      '2 wild salmon fillets (approx 150g each)',
      '1 cup shelled edamame beans (steamed)',
      '1 cup warm cooked brown jasmine rice',
      '1 cup steamed broccoli florets',
      '1 tbsp reduced-sodium soy sauce or tamari',
      '1 tsp toasted sesame oil, 1 tsp grated ginger, 1 tsp honey, sesame seeds',
    ],
    instructions: [
      '1. Whisk soy sauce, sesame oil, honey, and fresh grated ginger together for the glaze.',
      '2. Pat salmon fillets completely dry; season lightly with salt and pepper.',
      '3. Sear salmon in a hot skillet skin-side down for 4 minutes, flip and cook 3-4 minutes, brushing with glaze.',
      '4. Plate salmon alongside steamed brown rice, warm edamame, and broccoli. Garnish with toasted sesame seeds.',
    ],
  },
  {
    title: '4. Spicy Ground Turkey & Sweet Potato Skillet',
    category: 'Meal Prep Favorite',
    time: '30 mins | 3 Servings',
    macros: 'Calories: 430 | Protein: 36g | Carbs: 40g | Fat: 12g',
    ingredients: [
      '1 lb (450g) lean ground turkey (93/7 or 99/1)',
      '1 large sweet potato, peeled and diced into 1/2-inch cubes',
      '1 red bell pepper & 1/2 yellow onion, diced',
      '2 cups baby spinach leaves',
      'Seasoning: 1 tsp smoked paprika, 1 tsp cumin, 1/2 tsp chili flakes, garlic powder, salt',
    ],
    instructions: [
      '1. Steam or microwave diced sweet potatoes for 4 minutes until slightly fork-tender to speed up cooking.',
      '2. Brown ground turkey in a large non-stick skillet over medium-high heat, breaking apart with a spatula.',
      '3. Add diced bell peppers, onions, sweet potatoes, and spices. Sauté for 6-8 minutes until caramelized.',
      '4. Fold in baby spinach during the last 2 minutes until wilted. Divide into 3 meal prep containers.',
    ],
  },
  {
    title: '5. Crispy Tofu & Edamame Rainbow Crunch Bowl',
    category: 'Plant-Based Power',
    time: '25 mins | 2 Servings',
    macros: 'Calories: 420 | Protein: 28g | Carbs: 36g | Fat: 16g',
    ingredients: [
      '1 block (350g) extra firm tofu, pressed and cut into bite-sized cubes',
      '1 tbsp cornstarch or arrowroot powder (for crispiness)',
      '1 cup shelled edamame + 1 cup shredded purple cabbage & carrots',
      '1/2 cup cooked quinoa or warm farro',
      'Peanut Dressing: 2 tbsp natural peanut butter, 1 tbsp lime juice, 1 tbsp soy sauce, warm water',
    ],
    instructions: [
      '1. Toss pressed tofu cubes in cornstarch with a pinch of salt and garlic powder.',
      '2. Air fry at 400 F (200 C) for 14 minutes or bake until deeply golden and crispy.',
      '3. Whisk peanut butter, lime juice, soy sauce, and 1-2 tbsp warm water until smooth and pourable.',
      '4. Build bowls with quinoa, shredded cabbage, carrots, edamame, and crispy tofu. Drizzle peanut sauce over top.',
    ],
  },
  {
    title: '6. Mediterranean Cottage Cheese & Spinach Frittata',
    category: 'Breakfast / Brunch',
    time: '30 mins | 4 Servings',
    macros: 'Calories: 260 | Protein: 32g | Carbs: 6g | Fat: 11g',
    ingredients: [
      '6 large whole eggs + 1 cup liquid egg whites',
      '1 cup low-fat cottage cheese (blended until silky smooth)',
      '2 cups fresh baby spinach, roughly chopped',
      '1/2 cup sun-dried tomatoes (in oil, drained and chopped)',
      '1/3 cup crumbled feta cheese',
      '1 tsp dried oregano, black pepper, pinch of sea salt',
    ],
    instructions: [
      '1. Preheat oven to 375 F (190 C). Grease a 9-inch pie dish or oven-safe skillet.',
      '2. Whisk whole eggs, egg whites, blended cottage cheese, oregano, salt, and pepper in a large bowl.',
      '3. Sauté spinach and sun-dried tomatoes for 2 minutes; spread evenly across the baking dish.',
      '4. Pour egg mixture over veggies, scatter feta cheese on top, and bake for 22-25 minutes until eggs are set.',
    ],
  },
  {
    title: '7. Creamy Garlic Cottage Cheese Alfredo Pasta',
    category: 'Comfort Food Made Healthy',
    time: '15 mins | 2 Servings',
    macros: 'Calories: 460 | Protein: 35g | Carbs: 52g | Fat: 9g',
    ingredients: [
      '150g high-protein pasta (chickpea, lentil, or protein-enriched wheat)',
      '1 cup 2% cottage cheese',
      '1/4 cup grated Parmigiano-Reggiano',
      '2 cloves garlic, minced',
      '1/2 cup reserved warm pasta cooking water',
      'Fresh cracked black pepper, pinch of nutmeg, fresh chopped parsley',
    ],
    instructions: [
      '1. Cook pasta in salted boiling water until al dente. Reserve 1/2 cup of hot pasta water before draining.',
      '2. Blend cottage cheese, parmesan, minced garlic, black pepper, and 1/4 cup pasta water in a blender until silky.',
      '3. Return drained pasta to pot over very low heat. Pour creamy sauce over pasta and toss gently.',
      '4. Stir for 1 minute until warmed through, adding a splash of pasta water for desired glossiness. Top with parsley.',
    ],
  },
  {
    title: '8. Antioxidant Berry Blast Protein Smoothie Bowl',
    category: 'Quick Breakfast / Post-Workout',
    time: '5 mins | 1 Serving',
    macros: 'Calories: 340 | Protein: 30g | Carbs: 38g | Fat: 6g',
    ingredients: [
      '1 scoop (30g) vanilla or unflavored whey/plant protein powder',
      '1 cup frozen mixed berries (blueberries, raspberries, blackberries)',
      '1/2 frozen banana',
      '1/2 cup plain Greek yogurt',
      '1/4 cup unsweetened almond milk',
      'Toppings: 1 tbsp hemp hearts, fresh blueberries, 1 tbsp coconut flakes',
    ],
    instructions: [
      '1. Add almond milk and Greek yogurt first to the blender, followed by protein powder and frozen fruit.',
      '2. Blend on high speed, using a tamper if needed, until thick like soft-serve ice cream.',
      '3. Spoon into a chilled bowl.',
      '4. Arrange hemp hearts, fresh blueberries, and toasted coconut flakes on top. Enjoy immediately with a spoon!',
    ],
  },
  {
    title: '9. Lemon Garlic Herb Shrimp with Zucchini & Orzo',
    category: 'Quick Dinner',
    time: '18 mins | 2 Servings',
    macros: 'Calories: 380 | Protein: 34g | Carbs: 34g | Fat: 8g',
    ingredients: [
      '300g raw jumbo shrimp, peeled and deveined',
      '1 cup cooked whole wheat or chickpea orzo',
      '2 medium zucchinis, sliced into half-moons',
      '3 cloves garlic, thinly sliced',
      '1 tbsp olive oil, zest and juice of 1 lemon',
      '2 tbsp fresh chopped flat-leaf parsley & red pepper flakes',
    ],
    instructions: [
      '1. Heat olive oil in a wide skillet over medium heat. Add sliced garlic and red pepper flakes for 30 seconds.',
      '2. Add shrimp in a single layer; cook 2 minutes per side until pink and opaque. Transfer shrimp to a plate.',
      '3. In the same skillet, sauté sliced zucchini for 4 minutes until tender-crisp.',
      '4. Return shrimp to skillet with cooked orzo, fresh lemon juice, zest, and chopped parsley. Toss and serve hot.',
    ],
  },
  {
    title: '10. Slow-Cooker Shredded Salsa Verde Beef Bowls',
    category: 'Batch Cooking',
    time: '15 mins prep + slow cook | 4 Servings',
    macros: 'Calories: 470 | Protein: 40g | Carbs: 38g | Fat: 14g',
    ingredients: [
      '1.5 lbs (700g) lean beef chuck roast or flank steak, trimmed of excess fat',
      '1 jar (16 oz / 450g) mild or medium tomatillo salsa verde',
      '1 tsp cumin, 1 tsp dried oregano, 1 tsp garlic powder, 1 tsp salt',
      '2 cups cooked brown rice or cilantro-lime cauliflower rice',
      '1 cup canned black beans, rinsed and drained',
      'Garnish: fresh cilantro, lime wedges, sliced jalapeño',
    ],
    instructions: [
      '1. Place beef roast into slow cooker. Rub all over with cumin, oregano, garlic powder, and salt.',
      '2. Pour jar of salsa verde over the beef to coat evenly.',
      '3. Cover and cook on LOW for 7-8 hours or HIGH for 4-5 hours until beef is fall-apart tender.',
      '4. Shred beef with two forks directly in the cooking juices. Serve over brown rice and black beans with lime.',
    ],
  },
]

function generateEbookPdf() {
  const pdf = new SimplePdfWriter()

  // --- PAGE 1: COVER PAGE ---
  pdf.startPage()
  // Background card styling
  pdf.addRect(20, 20, 555.28, 801.89, 0.98, 0.97, 0.94, true, false)
  pdf.addRect(35, 35, 525.28, 771.89, 1, 1, 1, true, false)
  pdf.addLine(50, 770, 545, 770, 0.35, 0.5, 0.35, 3)

  // Header tag
  pdf.addText('HEALTHY WORM EXCLUSIVE GUIDE', 60, 740, 11, true, 0.35, 0.5, 0.35)
  pdf.addText('FREE DIGITAL RECIPE COLLECTION', 360, 740, 10, false, 0.5, 0.5, 0.5)

  // Title
  pdf.addText('10 Healthy High-Protein Recipes', 60, 680, 26, true, 0.18, 0.15, 0.1)
  pdf.addText('A Simple Guide to Delicious, Balanced Meals for Everyday Life', 60, 650, 13, false, 0.45, 0.4, 0.35)

  // Divider
  pdf.addLine(60, 630, 535, 630, 0.85, 0.85, 0.8, 1)

  // Highlight Box
  pdf.addRect(60, 480, 475, 120, 0.94, 0.97, 0.94, true, false)
  pdf.addText('INSIDE THIS GUIDE:', 80, 570, 12, true, 0.25, 0.45, 0.25)
  pdf.addText('+ 10 Kitchen-Tested Recipes with 28g to 42g Protein per Serving', 80, 545, 11, false, 0.2, 0.2, 0.2)
  pdf.addText('+ Complete Macronutrient Breakdown: Protein, Carbs, Fats & Calories', 80, 525, 11, false, 0.2, 0.2, 0.2)
  pdf.addText('+ Simple Everyday Ingredients - No Complicated Equipment Needed', 80, 505, 11, false, 0.2, 0.2, 0.2)

  // Welcome message
  pdf.addText('Welcome to Healthy Worm!', 60, 430, 15, true, 0.18, 0.15, 0.1)
  pdf.addText('Whether your goal is building lean muscle, managing healthy weight, or simply', 60, 400, 11, false, 0.3, 0.3, 0.3)
  pdf.addText('staying energized throughout busy workdays, eating enough protein makes a profound', 60, 380, 11, false, 0.3, 0.3, 0.3)
  pdf.addText('difference. Protein supports muscle recovery, balances blood sugar, and keeps you full.', 60, 360, 11, false, 0.3, 0.3, 0.3)

  pdf.addText('We created these 10 recipes to prove that healthy eating never has to taste bland or', 60, 325, 11, false, 0.3, 0.3, 0.3)
  pdf.addText('require hours in the kitchen. Every dish combines vibrant fresh ingredients, balanced', 60, 305, 11, false, 0.3, 0.3, 0.3)
  pdf.addText('macros, and genuine restaurant-quality flavor.', 60, 285, 11, false, 0.3, 0.3, 0.3)

  // Author & Footer
  pdf.addRect(60, 90, 475, 75, 0.96, 0.95, 0.92, true, false)
  pdf.addText('Healthy Worm Editorial Team', 80, 135, 12, true, 0.18, 0.15, 0.1)
  pdf.addText('Visit healthyworm.com for more weekly recipes, meal plans & fitness guides', 80, 115, 10, false, 0.45, 0.4, 0.35)
  pdf.addText('Copyright 2026 Healthy Worm. All rights reserved.', 80, 98, 8, false, 0.6, 0.6, 0.6)

  pdf.endPage()

  // --- PAGES 2 to 11: 10 INDIVIDUAL RECIPES ---
  recipes.forEach((r, idx) => {
    pdf.startPage()
    pdf.addRect(20, 20, 555.28, 801.89, 0.98, 0.97, 0.94, true, false)
    pdf.addRect(35, 35, 525.28, 771.89, 1, 1, 1, true, false)

    // Top Category & Page
    pdf.addText(`HEALTHY WORM HIGH-PROTEIN COLLECTION`, 60, 770, 9, true, 0.35, 0.5, 0.35)
    pdf.addText(`RECIPE ${idx + 1} OF 10`, 450, 770, 9, false, 0.5, 0.5, 0.5)
    pdf.addLine(60, 755, 535, 755, 0.85, 0.85, 0.8, 1)

    // Recipe Title
    pdf.addText(r.title, 60, 725, 16, true, 0.18, 0.15, 0.1)
    pdf.addText(`${r.category} | ${r.time}`, 60, 705, 11, false, 0.45, 0.4, 0.35)

    // Macro Badge Box
    pdf.addRect(60, 655, 475, 34, 0.92, 0.96, 0.92, true, false)
    pdf.addText(r.macros, 75, 668, 10, true, 0.2, 0.45, 0.2)

    // Ingredients section
    pdf.addText('INGREDIENTS:', 60, 630, 12, true, 0.18, 0.15, 0.1)
    let curY = 608
    r.ingredients.forEach((ing) => {
      pdf.addText(`•  ${ing}`, 70, curY, 9.5, false, 0.25, 0.25, 0.25)
      curY -= 20
    })

    // Divider
    curY -= 10
    pdf.addLine(60, curY, 535, curY, 0.9, 0.9, 0.85, 1)
    curY -= 25

    // Instructions section
    pdf.addText('PREPARATION STEPS:', 60, curY, 12, true, 0.18, 0.15, 0.1)
    curY -= 24
    r.instructions.forEach((step) => {
      // Wrap long step if necessary
      if (step.length > 85) {
        const splitIdx = step.lastIndexOf(' ', 85)
        const line1 = step.substring(0, splitIdx)
        const line2 = '   ' + step.substring(splitIdx + 1)
        pdf.addText(line1, 70, curY, 9.5, false, 0.25, 0.25, 0.25)
        curY -= 16
        pdf.addText(line2, 70, curY, 9.5, false, 0.25, 0.25, 0.25)
      } else {
        pdf.addText(step, 70, curY, 9.5, false, 0.25, 0.25, 0.25)
      }
      curY -= 22
    })

    // Footer
    pdf.addText('Healthy Worm  |  healthyworm.com', 60, 50, 9, false, 0.5, 0.5, 0.5)
    pdf.addText(`Page ${idx + 2}`, 490, 50, 9, false, 0.5, 0.5, 0.5)

    pdf.endPage()
  })

  // --- PAGE 12: GROCERY CHECKLIST & MEAL PREP TIPS ---
  pdf.startPage()
  pdf.addRect(20, 20, 555.28, 801.89, 0.98, 0.97, 0.94, true, false)
  pdf.addRect(35, 35, 525.28, 771.89, 1, 1, 1, true, false)

  pdf.addText('BONUS RESOURCE', 60, 770, 9, true, 0.35, 0.5, 0.35)
  pdf.addLine(60, 755, 535, 755, 0.85, 0.85, 0.8, 1)

  pdf.addText('High-Protein Grocery Checklist', 60, 720, 18, true, 0.18, 0.15, 0.1)
  pdf.addText('Stock your kitchen with these staples to hit your daily protein targets effortlessly:', 60, 698, 10, false, 0.45, 0.4, 0.35)

  // Checklist boxes
  const col1X = 60
  const col2X = 300
  let checkY = 660

  pdf.addText('LEAN PROTEINS', col1X, checkY, 11, true, 0.25, 0.45, 0.25)
  pdf.addText('PANTRY & GRAINS', col2X, checkY, 11, true, 0.25, 0.45, 0.25)
  checkY -= 22

  const col1Items = [
    '[ ] Boneless, skinless chicken breasts',
    '[ ] Extra-firm tofu (organic)',
    '[ ] 93% lean ground turkey',
    '[ ] Wild salmon fillets or canned tuna',
    '[ ] Large pasture-raised eggs & egg whites',
    '[ ] 2% or low-fat cottage cheese',
    '[ ] Plain 0% Greek yogurt',
    '[ ] Shelled edamame beans',
    '[ ] Raw peeled jumbo shrimp',
  ]

  const col2Items = [
    '[ ] Tri-color quinoa',
    '[ ] Certified gluten-free rolled oats',
    '[ ] Black beans & chickpeas (canned)',
    '[ ] High-protein chickpea/lentil pasta',
    '[ ] Quality vanilla whey or plant protein powder',
    '[ ] Chia seeds & hemp hearts',
    '[ ] Extra virgin olive oil & toasted sesame oil',
    '[ ] Natural peanut or almond butter',
    '[ ] Kalamata olives & sun-dried tomatoes',
  ]

  for (let i = 0; i < Math.max(col1Items.length, col2Items.length); i++) {
    if (col1Items[i]) pdf.addText(col1Items[i], col1X, checkY, 9, false, 0.25, 0.25, 0.25)
    if (col2Items[i]) pdf.addText(col2Items[i], col2X, checkY, 9, false, 0.25, 0.25, 0.25)
    checkY -= 18
  }

  // Meal Prep Strategies
  checkY -= 20
  pdf.addLine(60, checkY, 535, checkY, 0.85, 0.85, 0.8, 1)
  checkY -= 25
  pdf.addText('3 Golden Rules for High-Protein Meal Prep', 60, checkY, 13, true, 0.18, 0.15, 0.1)
  checkY -= 24

  pdf.addText('1. Batch Cook Your Primary Protein Twice a Week', 60, checkY, 10, true, 0.35, 0.5, 0.35)
  checkY -= 16
  pdf.addText('Cook 2 lbs of chicken breasts, ground turkey, or baked tofu on Sunday and Wednesday.', 75, checkY, 9, false, 0.3, 0.3, 0.3)
  checkY -= 22

  pdf.addText('2. Keep Ready-to-Eat High-Protein Snacks on Hand', 60, checkY, 10, true, 0.35, 0.5, 0.35)
  checkY -= 16
  pdf.addText('Hard-boiled eggs, single-serve Greek yogurts, and edamame save you from grabbing low-protein junk.', 75, checkY, 9, false, 0.3, 0.3, 0.3)
  checkY -= 22

  pdf.addText('3. Measure and Track for 7 Days to Calibrate Your Eye', 60, checkY, 10, true, 0.35, 0.5, 0.35)
  checkY -= 16
  pdf.addText('Weigh your portions for a single week to learn what 30-40 grams of protein looks like on a plate.', 75, checkY, 9, false, 0.3, 0.3, 0.3)

  pdf.addText('Healthy Worm  |  healthyworm.com', 60, 50, 9, false, 0.5, 0.5, 0.5)
  pdf.addText('Page 12', 490, 50, 9, false, 0.5, 0.5, 0.5)

  pdf.endPage()

  const buffer = pdf.build()
  const outDir = path.join(process.cwd(), 'data', 'ebooks')
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true })
  }
  const outFile = path.join(outDir, '10-healthy-high-protein-recipes.pdf')
  fs.writeFileSync(outFile, buffer)
  console.log(`Generated ${buffer.length} bytes PDF at ${outFile}`)
}

generateEbookPdf()
