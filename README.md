Slow Jam the Code
===========

![slowjam](https://raw.githubusercontent.com/hugs/slowjam/master/examples/slowjam.gif "Slow Jam the Code")


## Awesome features!

- Plays your code, slowly. Useful for recording software demos or closely watching Selenium user interface tests run.

- Can slow jam JavaScript, CoffeeScript, and Literate CoffeeScript.

- Simple API. Load and play -- that's all you need to know!

- Open source. (MIT License)


## Install

### Local

    npm install slowjam

### Everywhere

    npm install -g slowjam

## Example usage

### As a Library

#### Default
 
    slowjam = require('slowjam')
    jam = new slowjam.SlowJam()
    jam.load('/path/to/slowjam-worthy-code.js')
    jam.play()

#### Customized
    slowjam = require('slowjam')
    jam = new slowjam.SlowJam({'slowness':2000, 'log':true})
    jam.load('/path/to/slowjam-worthy-code.js')
    jam.play()

### From the Command Line

      slowjam /path/to/slowjam-worthy-code.js

## Options

### Slowness

By default, a one second delay is added between each statement.

    > jam.slowness = 1000   // 1000 milliseconds, or 1 second
   
You can speed up the jam by reducing the slowness.
   
    > jam.slowness = 500   // 500 milliseconds, or 0.5 seconds

Or slow your jam way down...
  
    > jam.slowness = 5000  // 5000 milliseconds, or 5 seconds
    
### Logging    

By default, slowjam does not log the statement about to be run to stdout.

    > jam.log = false

But you can turn that on.

    > jam.log = true
