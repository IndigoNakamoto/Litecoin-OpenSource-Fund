---
title: "Update 1"
summary: "In December 2022, despite health challenges, progress continued on PSBT development for MWEB. Initial design limitations were addressed, leading to the completion of key tasks. A basic functional test for hardware wallet workflow was also implemented. However, there won't be a January update due to planned time off."
date: "2022-01-31"
AuthorTwitterHandle: 'DavidBurkett38'
id: 1
---

## December 2022 Progress

I've been feeling under the weather for some time now, so I'm just now getting around to December's update :face_with_thermometer:

### Progress Update

I continued working on PSBT, and quickly discovered some limitations in my initial design. I had to redefine a lot of the MWEB fields before I could proceed with the PSBT tasks I listed last month. After doing that, I was able to complete the first 3 tasks:

1. Add signing logic for inputs 10 and outputs 1
2. Write the transaction finalization logic here (Task 6)
3. Implement component “merging” here (Task 10)

I also have a basic functional test for the hardware wallet workflow (Task 4), but there are a lot of scenarios I still want to add tests for.

### Note

I will be taking some time off, so there will not be a January update.
