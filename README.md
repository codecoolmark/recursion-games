# Recursion Games

Welcome to the recursion games! The recursion games will introduce to one of
the, if not the, most powerful programming techniques: *recursion*. Let's start
with an example: A family tree for example take a look at this (sub) tree of the Habsburg family:

![A subtree of the Habsburg family tree](habsburgs.gv.svg "A subtree of the Habsburg family tree")

Now lets consider the following problem: We want to know the number of descendants of Maria Theresa. We start by following the arrows originating from Maria Theresa and we find the nodes

* Maria Anna,
* Maria Amalia,
* Marie Christine,
* Leopold II.,
* Maria Elizabeth,
* Joseph II.,
* Maria Karoline,
* Maria Antonia,
* Ferdinand,
* Maximilian.

In total 10 children of course this is not total number of Maria Teresa's
descendents since each of them could have children on their own. In the next step we go through each of the children and count their children. In our tree we find only children of Leopold II.

* Maria Theresia,
* Franz II./I.,
* Ferdinand III.,
* Karl,
* Joseph,
* Johann,
* Rainer,
* Ludwig,
* Rudolf.

In total Leopold II. had 9 children which brings the number of Maria Teresa's descendants to 19. Again we are not yet finished because each of these people could have children on their own. Indeed we find that Franz II./I. has 3 children

* Marie Lousie,
* Ferdinand I.,
* Franz Karl.

Which brings the number Maria Teresa's descendants to 22. As before we have to check if each of them have children themselfs. We find that none of them have and we have found that the number of Maria Teresa's descendants, in our tree, to be 22.

As you can guess our goal is program a function that can calculate the number of descendants of Maria Teresa. In order to do that we need to think about two questions.

* How do we represent the family tree in our code?
* How do we implement our function?.

The answer to first questions is given to us. If we check the `habsburgs.json` file we find that the data is structured like this

```json
{
  "name": "Family tree of Habsburg-Lorraine",
  "tree": {
    "name": "Maria Theresa",
    "yearOfBirth": 1717,
    "yearOfDeath": 1780,
    "spouses": [{
      "name": "Franz I. Stephan",
      "yearOfBirth": 1708,
      "yearOfDeath": 1765
    }],
    "children": [{
      "name": "Maria Anna",
      "yearOfBirth": 1758,
      "yearOfDeath": 1789
    }, ..., {
      "name": "Leopold II.",
      "yearOfBirth": 1747,
      "yearOfDeath": 1792,
      "spouses": [{
        "name": "Maria Ludovica of Bourbon Spain"
      }],
      "children": [{
        "name": "Maria Theresia",
        "yearOfBirth": 1767,
        "yearOfDeath": 1827
      }, {
        "name": "Franz II./I.",
        "yearOfBirth": 1768,
        "yearOfDeath": 1855,
        "spouses": [{
            "name": "Elisabeth of Württemberg"
          }, {
            "name": "Maria Theresa of Bourbon-Naples"
          }, {
            "name": "Maria Ludovica of Modena"
          }, {
            "name": "Caroline Aguste of Bavaria"
          }
        ],
        "children": [...]
      }, ...]
    }, ...]
  }
}
```

Each person in the tree is represented as a object. The object contains the
name and further information about the person. If the person has children it
has a `children` property that contains an array of object that represent the
children. If any of these children have children on their own they also have a `children` property.

Let's look at a simple example

![starks.gv.svg](starks.gv.svg "Stark family tree")

in our object format this tree would look like this
```json
{
    "name": "Richard Stark",
    "children": [{
        "name": "Eddard Stark",
        "children": [{
            "name": "Robb Stark"
        }, {
            "name": "Sansa Stark"
        }, {
            "name": "Arya Stark"
        }, {
            "name": "Bran Stark"
        }, {
            "name": "Rickon Stark"
        }]
    }, {
        "name": "Brandon Stark"
    }, {
        "name": "Lyanna Stark"
    }, {
        "name": "Benjen Stark"
    }]
}
```

Now let's go back the our original problem. We want to count all descendants of. Starting from the root we counted the number of children, in the next step we moved to count the number of children of each children. Let's see how we can implement this in Javascript.

In a first step we write a function the finds the number of children of the
first (root) node in the tree. We will write our code in the `descendants.js`
file.

Task 1: Write a function `numberOfChildren` that given a family tree computes 
the number of children at the root of a tree. Test your function on the two 
family trees (`habsburgs` and `starks`).

<details>
<summary>Solution for Task 1</summary>

```javascript
function getNumberOfChildren(person) {
    if (person.children !== undefined) {
      return person.children.length;
    }
    return 0;
}
```

</details>

Now we start by writing a function the calculates the number of descendants. In a first we get the number of children:

```javascript
function getNumberOfDescendants(person) {
  const numberOfChildren = getNumberOfChildren(person);
  return numberOfChildren;
}
```

Of course this function is not yet finished we need to include the number of children of the children.

```javascript
function getNumberOfDescendants(person) {
  const numberOfChildren = getNumberOfChildren(person);

  let numberOfDescendants = numberOfChildren;

  if (person.children !== undefined) {
    for (const child of person.children) {
      numberOfDescendants = numberOfDescendants + getNumberOfChildren(child);
    }
  }

  return numberOfDescendants;
}
```

Task 2: Use the implementation from above and check it on the Stark and Habsburg family trees.

<details>
<summary>Solution for Task 2</summary>
Running

```javascript
console.log(getNumberOfDescendants(habsburgs.tree))
console.log(getNumberOfDescendants(starks.tree))
```

should print

```
19
9
```
to the console.
</details>

If we compare the results with the images of the trees we see that it is 
correct for Stark family tree but incorrect for the Habsburg tree. The 
reason is that we only take into account the children of children but not
the children of children of children and so forth. Following our ideas we
we could update our `getNumberOfDescendants` function like this

```javascript
function getNumberOfDescendants(person) {
  const numberOfChildren = getNumberOfChildren(person);

  let numberOfDescendants = numberOfChildren;

  if (person.children !== undefined) {
    for (const child of person.children) {
      numberOfDescendants = numberOfDescendants + getNumberOfChildren(child);
    }

    if (child.children !== undefined) {
      for (const grandChild of child.children) {
        numberOfDescendants = numberOfDescendants + getNumberOfChildren(child);
      }
    }
  }

  return numberOfDescendants;
}
```

Now lets investigate this function further we basically copied the code for
calculating the number of children of children which allows us the include
the number of children of children of children. Now if we want to include the
number of children of children of children of children we would need to copy
the code again but there is another trick what if we would reuse our 
`getNumberOfDescendants` function again? Because another of calculating the
number of descendants can also be done by summing the number of descendants of
the children. Following this idea gives us this version

```javascript
function getNumberOfDescendants(person) {
  const numberOfChildren = getNumberOfChildren(person);

  let numberOfDescendants = numberOfChildren;

  if (person.children !== undefined) {
    for (const child of person.children) {
      numberOfDescendants = numberOfDescendants + getNumberOfDescendants(child);
    }
  }

  return numberOfDescendants;
}
```

Task 3: Verify that this function gives us the correct result and use console.log to understand what is happening.

<details>
<summary>Solution for Task 3</summary>
Running

```javascript
console.log(getNumberOfDescendants(habsburgs.tree))
console.log(getNumberOfDescendants(starks.tree))
```

should print

```
22
9
```
to the console.
</details>