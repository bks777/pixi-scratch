# PIXI Scratch

Simple and fast scratching.
ES5 + HTML5 Canvas

Main idea was to draw a circle with a rectangles. Due to performance 
issues, it was decided to use only **_three rectangle areas_**.
  * BASE area with maximum diagonals width that circle can consist
  * HORIZONTAL area with x2 circle radius widths
  * VERTICAL area with x2 circle radius widths
Besides, for more '**_eraser_**' effect, it was decided to use
 **_ghost rectangle_** with X and Y positive offset.

For visual comparison, it was added stats with fps and draw time(change
by a tap).

Application was tested on 5 mobile devices, 
* old ASUS with 4.4 Android
* iPhone 5s
* iPhone 6
* iPhone 6S 
* iPhone SE
Result of tests: satisfied. 

During tests was noticed such features: 
* during fast swap, noticed dotted line. --> ignored, because this
feature seems to be like real life coin fast scratching
* pixel dotting --> ignored, because of no technical need to make it 
 more smooth, and performance issues.
 
In case of real scratch game creation, I would make separate 
module system, added win animation in a "betline" style, adding auto 
completion of scratch box, garbage particles, coin in desktop version
and acceleration. 

Demo is here: https://bks777.github.io/pixi-scratch/
