# PIXI Scratch

Simple and fast scratching.
ES5 + HTML5 Canvas

Main idea was to draw a circle with a rectangles. Due to performance 
issues, it was decided to use only three rectangle areas.
  * BASE area with maximum diagonals width that circle can consist
  * HORIZONTAL area with x2 circle radius widths
  * VERTICAL area with x2 circle radius widths
Besides, for more 'eraser' effect, it was decided to use ghost rectangle
with X and Y positive offset.

For visual comparison, it was added stats with fps and draw time(change
by a tap)
Application was tested on 5 mobile devices, 
* old ASUS with 4.4 Android
* iPhone 5
* iPhone 6
* iPhone 6S 
* iPhone SE
Result of tests: minimum **FPS** was **55**,
Maximum draw time was **8MS**

Demo is here: https://bks777.github.io/pixi-scratch/
