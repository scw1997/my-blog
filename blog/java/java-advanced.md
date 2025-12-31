# Java高级

## 集合

Java集合框架是一组**用于存储和操作对象**的接口和实现类，位于java.util包中。它提供了多种数据结构实现，如列表、集合、队列和映射等。

**1. 单列集合**

包含add()，clear(),remove(),contains(),isEmpty(),size()等通用方法，包含以下三大子类：

`List（接口）`：有序集合，允许重复元素（如ArrayList、LinkedList）

`Set（接口）`：无序集合，不允许重复元素（如HashSet、TreeSet）

`Queue`：队列（如LinkedList、PriorityQueue）

**2. 双列集合**

包含put()，remove(),clear(),containsKey()等通用方法

`Map`：键值对集合（如HashMap、TreeMap）


### List

特点：**有序，可重复，有索引**

- ArrayList：相当于长度可变的数组，查询快，增删慢，非线程安全
- LinkedList：基于双向链表实现，查询慢，增删快

:::code-group
```java [ArrayList]
List<String> list = new ArrayList<>();
list.add("Apple");
list.add("Banana");
list.get(0); // "Apple"
```
```java [LinkedList]
List<String> linkedList = new LinkedList<>();
linkedList.addFirst("Head"); // 添加到头部
linkedList.addLast("Tail");  // 添加到尾部
```
:::

#### 迭代器

```java
List<String> list = new ArrayList<>(Arrays.asList("A", "B", "C"));
Iterator<String> it = list.iterator();
while (it.hasNext()) {
    String s = it.next();
    //迭代器遍历时，不可用集合的方法去添加和删除元素，会报并发修改异常
    //只能用迭代器的方法remove去删除，添加的话没有办法
    if ("B".equals(s)) {
         it.remove(); // 正确方式
        // list.remove(s); // 错误方式，会抛出ConcurrentModificationException
    }
}
```

#### 增强for循环（for-each 循环）
所有的`基于Collection的变量即实现了Iterable 接口的对象（如List和Set）或者数组`可以使用增强for循环
```java
 //定义arrayList并设置初始值
Collection<String> list = new ArrayList<>(Arrays.asList("1","2","3","4","5","6","7","8","9"));
        list.add("A");
        list.add("B");
        list.add("C");
        //这里s是一个独立的第三方变量，在for循环中修改不会影响list        
        for (String s : list) {
            System.out.println(s);
        }
//数组
int[] numbers = {1, 2, 3, 4, 5};
for (int num : numbers) {
        System.out.println(num);
}

//Set集合
Set<Integer> set = new HashSet<>(Arrays.asList(10, 20, 30));
for (int value : set) {
        System.out.println(value);
}
```

#### List的常见遍历方式

:::code-group

```java [for循环]
List<String> list = Arrays.asList("A", "B", "C");
for (int i = 0; i < list.size(); i++) {
    System.out.println(list.get(i));
}
```
```java [增强for循环]
List<String> list = Arrays.asList("A", "B", "C");
for (String item : list) {
    System.out.println(item);
}
```
```java [Iterator迭代器]
List<String> list = Arrays.asList("A", "B", "C");
Iterator<String> iterator = list.iterator();
while (iterator.hasNext()) {
    String item = iterator.next();
    System.out.println(item);
    // iterator.remove(); // 可删除当前元素
}
```

```java [forEach配合lambda表达式]
List<String> list = Arrays.asList("A", "B", "C");
list.forEach(item -> System.out.println(item));

// 方法引用简化
list.forEach(System.out::println);
```
```java [列表迭代器（可添加元素）]
List<String> list = new ArrayList<>(Arrays.asList("A", "B", "C"));
ListIterator<String> listIterator = list.listIterator();

//支持前后双向遍历。
while (listIterator.hasNext()) {
    System.out.println("Forward: " + listIterator.next());
}
while (listIterator.hasPrevious()) {
    System.out.println("Backward: " + listIterator.previous());
}
```
:::

### Set

特点：**无序，不重复，无索引**

#### HashSet：

基于哈希表实现，无序，查询快。

适合`快速去重但忽略顺序`的场景

```java 
import java.util.HashSet;
import java.util.Set;

public class HashSetExample {
    public static void main(String[] args) {
        Set<String> set = new HashSet<>();
        set.add("Apple");
        set.add("Banana");
        set.add("Apple"); // 重复元素，不会被添加

        System.out.println(set); // 输出顺序可能不同：[Apple, Banana]
        System.out.println("Size: " + set.size()); // 输出: Size: 2
    }
}
```

#### LinkedHashSet

继承自 HashSet，但通过**链表**维护插入顺序，**所以它有顺序**。

适合`需要去重且保留插入顺序`的场景。

```java
import java.util.LinkedHashSet;
import java.util.Set;

public class LinkedHashSetExample {
    public static void main(String[] args) {
        Set<String> set = new LinkedHashSet<>();
        set.add("Apple");
        set.add("Banana");
        set.add("Orange");
        set.add("Apple"); // 重复元素，不会被添加

        System.out.println(set); // 输出顺序与插入一致：[Apple, Banana, Orange]
    }
}
```


#### TreeSet

基于红黑树实现，元素按自然顺序或自定义比较器排序。

适合`需要去重且排序`的场景。

默认排序规则：

- 对于数值类型：默认按照从小到大排序
- 对于字符（串）类型：默认按照字符的ASCII的数字升序排序

可通过`构造方法传入 Comparator`，覆盖默认的排序规则。

:::code-group
```java [默认排序]
import java.util.Set;
import java.util.TreeSet;

public class TreeSetExample {
    public static void main(String[] args) {
        Set<String> set = new TreeSet<>();
        set.add("Banana");
        set.add("Apple");
        set.add("Orange");
        set.add("Apple"); // 重复元素，不会被添加

        System.out.println(set); // 输出按字母顺序排序：[Apple, Banana, Orange]
    }
}
```
```java [comparator自定义排序]
TreeMap<String, Integer> treeMap = new TreeMap<>((a, b) -> a.length() - b.length());
treeMap.put("Banana", 3);
treeMap.put("Apple", 5);
treeMap.put("Cherry", 2);

System.out.println(treeMap); // 输出: {Apple=5, Banana=3, Cherry=2}（键长度 5, 6, 6）
```
```java [自定义对象排序]
// //自定义对象作为元素时，必须实现 Comparable 或提供 Comparator（因为此时无法排序）
class Person implements Comparable<Person> {
    String name;
    int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    @Override
    public int compareTo(Person other) {
        return this.age - other.age; // 按年龄升序
    }

    @Override
    public String toString() {
        return name + "(" + age + ")";
    }
}

TreeSet<Person> people = new TreeSet<>();
people.add(new Person("Alice", 25));
people.add(new Person("Bob", 20));
people.add(new Person("Charlie", 22));

System.out.println(people); // 输出: [Bob(20), Charlie(22), Alice(25)]
```
:::
:::tip 扩展
- HashSet 和 LinkedHashSet 允许一个 null 元素。TreeSet 不允许 null（因为无法比较排序）。
- 性能排序：HashSet > LinkedHashSet > TreeSet
:::
#### HashCode

Java中的所有对象示例都有一个方法hashCode()返回了该对象的哈希值,它代表的是对象的整数表现形式。

默认情况，hashCode方法是基于对象的地址值计算出哈希值，所以不同对象（即使内容相同）的hash值是不一样的。

> 但是极小部分情况下，不同的属性或者不同的地址值计算的哈希值有可能一样（哈希碰撞）

:::tip 为什么要重写 equals() 和 hashCode()

默认情况下，equals()是通过比较对象的地址值来判断两个对象是否相等，但是通常使用这个方法意义不大，因为除非是同一个对象否则该方法只返回false

通常我们会认为两个对象的各自的属性内容相同的话，就认为是同一个对象。所以此时要按照自己期望的规则重写equals方法。


> 关键规则：`如果两个对象 equals() 相等，那么它们的 hashCode() 必须相等`

**而当我们重写了equals方法后，在使用HashSet和HashMap时必须要重写hashCode方法**：

因为HashSet，HashMap等哈希集合在将某个对象添加为key或者元素时会进行判断去重处理，会先判断HashCode()是否相等再通过equals()判断。假设此时我们重写了equals方法但没重写hashCode方法，并且依次添加了两个属性内容相同的对象元素。

此时我们希望它认为是重复的元素。但由于此时没重写hashCode方法，固定返回false。此时就已经认为对象不相等了，所以不会后续再调用equals方法。所以此时要重写hashCode方法。


:::

```java
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

class Person {
    private String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    // 必须重写 equals 和 hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Person person = (Person) o;
        return age == person.age && Objects.equals(name, person.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, age);
    }
}

public class EqualsHashCodeExample {
    public static void main(String[] args) {
        Set<Person> set = new HashSet<>();
        set.add(new Person("Alice", 25));
        set.add(new Person("Alice", 25)); // 重复对象，不会被添加

        System.out.println(set.size()); // 输出: 1
    }
}
```
### Map

List和Set都属于单列集合，Map是双列集合（元素为键值对）,包含：

- **HashMap**：

   基于哈希表实现，允许null键和null值，不保证顺序。

  依赖hashCode和equals来保证`键`的唯一。如果键存的是自定义对象，则需要重写上述两个方法来确保唯一性。


- **LinkedHashMap**：

  HashMap的子类，但通过双向链表维护插入顺序。

- **TreeMap**：

  基于红黑树实现，按键的自然顺序或自定义比较器排序

  默认排序规则：

  - 对于数值类型：默认按照从小到大排序
  - 对于字符（串）类型：默认按照字符的ASCII的数字升序排序

  可通过`构造方法传入 Comparator`，覆盖默认的排序规则。

  :::code-group
  ```java [默认排序]
  import java.util.HashMap;
  import java.util.Map;
  
  public class MapExample {
      public static void main(String[] args) {
          // 创建HashMap
          Map<String, Integer> ageMap = new HashMap<>();
          
          // 添加元素
          ageMap.put("Alice", 25);
          ageMap.put("Bob", 30);
          ageMap.put("Charlie", 35);
          
          // 获取元素
          System.out.println("Alice's age: " + ageMap.get("Alice")); // 输出: 25
          
          // 检查键是否存在
          System.out.println("Contains key 'Bob'? " + ageMap.containsKey("Bob")); // true
          
          // 检查值是否存在
          System.out.println("Contains value 40? " + ageMap.containsValue(40)); // false
          
          // 遍历Map
          for (Map.Entry<String, Integer> entry : ageMap.entrySet()) {
              System.out.println(entry.getKey() + ": " + entry.getValue());
          }
          
          // 删除元素
          ageMap.remove("Charlie");
          
          // 获取大小
          System.out.println("Map size: " + ageMap.size()); // 2
      }
  }
  ```
  ```java [自定义比较器]
  TreeMap<String, Integer> treeMap = new TreeMap<>((a, b) -> a.length() - b.length());
  treeMap.put("Banana", 3);
  treeMap.put("Apple", 5);
  treeMap.put("Cherry", 2);
  
  System.out.println(treeMap); // 输出: {Apple=5, Banana=3, Cherry=2}（键长度 5, 6, 6）
  ```
  ```java [自定义对象排序]
  //自定义对象作为键时，必须实现 Comparable 或提供 Comparator（因为此时无法排序）
  class Person implements Comparable<Person> {
     String name;
      int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    @Override
    public int compareTo(Person other) {
        return this.age - other.age; // 按年龄升序
    }

    @Override
    public String toString() {
        return name + "(" + age + ")";
    }
  }
  
  TreeMap<Person, String> personMap = new TreeMap<>();
  personMap.put(new Person("Alice", 25), "Engineer");
  personMap.put(new Person("Bob", 20), "Student");
  personMap.put(new Person("Charlie", 22), "Doctor");
  
  System.out.println(personMap);
  // 输出: {Bob(20)=Student, Charlie(22)=Doctor, Alice(25)=Engineer}
  ```
:::warning 注意事项

- 每个键最多映射到一个值，添加重复键，新值会覆盖旧值
- HashMap允许一个null键，TreeMap不允许null键
- put添加键值时，若不是重复键则put方法返回null，否则返回被覆盖的值
:::

#### Map的遍历方式

:::code-group
```java [keySet方式]
Map<String, Integer> map = new HashMap<>();
map.put("a", 1);
map.put("b", 2);

// 方式1：使用迭代器
Iterator<String> iterator = map.keySet().iterator();
while (iterator.hasNext()) {
    String key = iterator.next();
    System.out.println("Key: " + key + ", Value: " + map.get(key));
}

// 方式2：增强for循环
for (String key : map.keySet()) {
    System.out.println("Key: " + key + ", Value: " + map.get(key));
}
```
```java [键值对方式]
// 方式1：使用迭代器
Iterator<Map.Entry<String, Integer>> entryIterator = map.entrySet().iterator();
while (entryIterator.hasNext()) {
    Map.Entry<String, Integer> entry = entryIterator.next();
    System.out.println("Key: " + entry.getKey() + ", Value: " + entry.getValue());
}

// 方式2：增强for循环（推荐）
for (Map.Entry<String, Integer> entry : map.entrySet()) {
    System.out.println("Key: " + entry.getKey() + ", Value: " + entry.getValue());
}
```
```java [forEach + lambda]
// 遍历键值对
map.forEach((key, value) -> {
    System.out.println("Key: " + key + ", Value: " + value);
});

// 如果需要修改值（注意：不能直接修改key）
map.replaceAll((key, value) -> value * 2); // 所有值乘以2
```
:::


### Collections
`java.util.Collections` 是 Java 提供的一个 集合工具类（非接口/类），它包含大量静态方法，用于操作或返回集合（如 List、Set、Map 等）。

```java
import java.util.*;

public class CollectionsDemo {
    public static void main(String[] args) {
        // 1. 排序
        List<Integer> nums = new ArrayList<>(Arrays.asList(5, 2, 9, 1));
        Collections.sort(nums); // [1, 2, 5, 9]

        // 2. 查找
        int max = Collections.max(nums); // 9
        int index = Collections.binarySearch(nums, 5); // 2

        // 3. 同步集合
        List<String> syncList = Collections.synchronizedList(new ArrayList<>());

        // 4. 不可变集合
        List<String> immutable = Collections.unmodifiableList(Arrays.asList("X", "Y"));

        // 5. 填充与替换
        Collections.fill(nums, 0); // [0, 0, 0, 0]
        Collections.replaceAll(nums, 0, 10); // [10, 10, 10, 10]

        // 6. 随机操作
        Collections.shuffle(nums); // 可能输出: [10, 10, 10, 10]（需先填充不同值）

        // 7. 其他工具方法
        boolean hasDuplicate = Collections.frequency(nums, 10) > 1;
    }
}
```

### 不可变集合

不可变集合（Immutable Collections） 是指一旦创建后，其内容不能被修改（添加、删除、替换元素等）的集合。

Java 9+ 引入了List.of()、Set.of()、Map.of()
```java
import java.util.*;

public class Java9ImmutableCollections {
    public static void main(String[] args) {
        // 1. 创建不可变List
        List<String> immutableList = List.of("Apple", "Banana", "Orange");
        System.out.println("不可变List: " + immutableList); // [Apple, Banana, Orange]

        // 2. 创建不可变Set
        Set<Integer> immutableSet = Set.of(1, 2, 3);
        System.out.println("不可变Set: " + immutableSet); // [1, 2, 3]

        // 3. 创建不可变Map
        Map<String, Integer> immutableMap = Map.of(
            "Alice", 25,
            "Bob", 30
        );
        System.out.println("不可变Map: " + immutableMap); // {Alice=25, Bob=30}

        // 4. 尝试修改（抛出 UnsupportedOperationException）
        try {
            immutableList.add("Grape"); // 抛出异常
        } catch (UnsupportedOperationException e) {
            System.out.println("无法修改Java 9不可变List: " + e.getMessage());
        }

        // 5. 使用Map.ofEntries()支持更多键值对
        Map<String, Integer> largeMap = Map.ofEntries(
            Map.entry("X", 100),
            Map.entry("Y", 200),
            Map.entry("Z", 300)
        );
        System.out.println("大型不可变Map: " + largeMap); // {X=100, Y=200, Z=300}
      
    }
}
```

jdk10+ 中创建不可变的Map集合推荐使用`Map.copyOf()`

```java
      HashMap<String,Integer> hm = new HashMap<>();

      hm.put("one",1);
      hm.put("two",2);
      hm.put("three",3);

      Map<String,Integer> immutableHashMap = Map.copyOf(hm);
      System.out.println(immutableHashMap);
      immutableHashMap.put("four",4); //报错
```
:::warning
- 不支持 null 元素。
- Map.of() 最多支持 10 个键值对（超过需用 Map.ofEntries()）。
:::

### Stream流

Stream API 是 Java 8 引入的一个强大的函数式数据处理特性，它提供了一种高效且易于理解的方式来处理`集合`数据。

#### 单列集合自带Stream

```java
List<String> names = Arrays.asList("Alice", "Bob", "Charlie", "David", "Eve");

// 过滤长度大于3的名字，转为大写，排序后收集
List<String> result = names.stream()
            .filter(name -> name.length() > 3)
        .map(String::toUpperCase) //方法引用，调用String的toUpperCase方法
        .sorted()
        .collect(Collectors.toList()); //处理后的数据收集到一个集合List里，还可以是toSet()和toMap()
        // collect(Collectors.toSet())
        // .collect(Collectors.toMap(item->item.charAt(0),item->item.charAt(1)))

System.out.println(result); // 输出: [ALICE, CHARLIE, DAVID]
```
:::warning
- `filter，map，sorted`等方法为中间操作，表示这些操作执行的返回值是stream流，后续可以再链式调用stream相关操作
- `forEach,toArray,collect`等方法为终结操作，表示这些操作执行的返回值不是stream流，后续不能再链式调用stream相关操作
:::
#### Arrays.stream

Arrays.stream() 是 java.util.Arrays 类提供的静态方法，用于将数组转换为流（Stream）

```java
import java.util.Arrays;
import java.util.stream.Stream;

   // 1. 对象数组转流
        String[] names = {"Alice", "Bob", "Charlie"};
        Stream<String> nameStream = Arrays.stream(names);
        nameStream.forEach(System.out::println);
 
        // 2. 部分数组转流（索引范围）
        Stream<String> partialStream = Arrays.stream(names, 0, 2); // "Alice", "Bob"
        partialStream.forEach(System.out::println);
 
        // 3. 基本类型数组转流
        int[] numbers = {1, 2, 3, 4, 5};
        Arrays.stream(numbers).forEach(System.out::println); // IntStream
```

#### Stream.of

```java
import java.util.Arrays;
import java.util.stream.Stream;

// 1. 可变参数转流
Stream<String> nameStream = Stream.of("Alice", "Bob", "Charlie");
        nameStream.forEach(System.out::println);

        // 2. 单个元素转流
        Stream<String> singleStream = Stream.of("Hello");
        singleStream.forEach(System.out::println);

        // 3. 数组转流（引用类型）
        String[] names = {"Alice", "Bob", "Charlie"};
        Stream<String> arrayStream = Stream.of(names); // 等同于 Arrays.stream(names)
        arrayStream.forEach(System.out::println);
        
        //4 .数组转流（基本类型）

        int[] names = {1, 2, 3};
        //注意：基本类型的数组会被看成一个整体，而不是元素遍历
        Stream.of(names).forEach(System.out::println); //只打印一次，[I@6d311334
```
Stream.of() 是 java.util.stream.Stream 类的静态方法，用于将单个元素或可变参数转换为流（Stream）
:::warning

- Map（双列集合）不能直接使用stream，可通过`keySet()或entrySet()`间接返回单列集合来操作stream
:::
## 泛型

- 泛型不能传递基本数据类型（可以是基本类型的包装类型）
- 泛型类型确定后，可以传递该类型以及其子类类型
- 不写泛型，默认就是`Object`
- 泛型不具备继承性（不支持多态），但是数据支持继承性

#### 基本使用

:::code-group
```java [泛型类]
// 泛型类示例
class Box<T> {
    private T content;

    public void setContent(T content) {
        this.content = content;
    }

    public T getContent() {
        return content;
    }
}

// 使用
public class Main {
    public static void main(String[] args) {
        Box<String> stringBox = new Box<>(); // 指定类型为 String
        stringBox.setContent("Hello");
        System.out.println(stringBox.getContent()); // 输出: Hello

        Box<Integer> intBox = new Box<>(); // 指定类型为 Integer
        intBox.setContent(42);
        System.out.println(intBox.getContent()); // 输出: 42
    }
}
```
```java [泛型方法]
class GenericMethods {
    // 泛型方法
    public static <T> void printArray(T[] array) {
        for (T element : array) {
            System.out.print(element + " ");
        }
        System.out.println();
    }
}

// 使用
public class Main {
    public static void main(String[] args) {
        String[] strings = {"A", "B", "C"};
        Integer[] integers = {1, 2, 3};

        GenericMethods.printArray(strings); // 输出: A B C
        GenericMethods.printArray(integers); // 输出: 1 2 3
    }
}
```
```java [泛型接口]
interface Container<E> {
    void add(E item);
    E get(int index);
}

class ListContainer<E> implements Container<E> {
    private E[] items;
    private int size;

    public ListContainer(int capacity) {
        items = (E[]) new Object[capacity];
    }

    @Override
    public void add(E item) {
        items[size++] = item;
    }

    @Override
    public E get(int index) {
        return items[index];
    }
}

// 使用
public class Main {
    public static void main(String[] args) {
        Container<String> container = new ListContainer<>(10);
        container.add("Java");
        System.out.println(container.get(0)); // 输出: Java
    }
}
```
:::

#### 泛型通配符

? 表示未知类型，常用于方法参数或返回值，提高灵活性。

上界通配符： **? extends T：表示类型是 T 或其子类**。

下界通配符：**? super T：表示类型是 T 或其父类**。
```java
// 上界通配符示例
public static void printList(List<? extends Number> list) {
    for (Number num : list) {
        System.out.println(num);
    }
}

// 使用
List<Integer> intList = Arrays.asList(1, 2, 3);
List<Double> doubleList = Arrays.asList(1.1, 2.2);
printList(intList); // 合法
printList(doubleList); // 合法
```

## 方法引用

```java
import java.util.Arrays;
import java.util.List;
import java.util.function.Function;
import java.util.function.Supplier;

public class MethodReferenceExample {
    public static void main(String[] args) {
        List<String> names = Arrays.asList("Alice", "Bob", "Charlie");
        
        // 1. 引用静态方法
        names.forEach(System.out::println); // 等同于 names.forEach(s -> System.out.println(s));
        
        // 2. 引用实例方法（特定对象）
        MethodReferenceExample example = new MethodReferenceExample();
        names.forEach(example::printUpperCase); // 等同于 names.forEach(s -> example.printUpperCase(s));
        
        // 3. 引用任意对象的实例方法
        names.forEach(String::toUpperCase); // 等同于 names.forEach(s -> s.toUpperCase());
        
        // 4. 引用构造器
        Supplier<List<String>> listSupplier = ArrayList::new; // 等同于 () -> new ArrayList<String>()
        List<String> newList = listSupplier.get();
        
        // 5. 引用数组构造器
        Function<Integer, int[]> arrayCreator = int[]::new; // 等同于 size -> new int[size]
        int[] array = arrayCreator.apply(5);
    }
    
    public void printUpperCase(String s) {
        System.out.println(s.toUpperCase());
    }
}
```
:::warning 注意

- 如果要引用本类中的成员方法，则可使用`this::方法名`，如果是父类的成员方法，则是`super::方法名`
:::


## 异常处理

异常体系中的最上层父类是`Exception`，分为编译时和运行时异常

异常的作用：

- 调试bug的参考信息
- 作为方法内部的特殊返回值



**编译时异常**：

编译阶段就会报错，直接继承于`Exception`

例如：IOException, SQLException

**运行时异常**：

编译阶段没有报错，运行时出现的，为`RuntimeException`本身及其子类

例如NullPointerException, ArrayIndexOutOfBoundsException


#### 多个异常的捕捉处理方式

:::code-group
```java [多个catch块]
try {
    // 可能抛出多种异常的代码
    int result = 10 / 0; // ArithmeticException
    String str = null;
    int length = str.length(); // NullPointerException
    int[] arr = new int[5];
    int num = arr[10]; // ArrayIndexOutOfBoundsException
} catch (ArithmeticException e) {
    System.out.println("算术异常: " + e.getMessage());
} catch (NullPointerException e) {
    System.out.println("空指针异常: " + e.getMessage());
} catch (ArrayIndexOutOfBoundsException e) {
    System.out.println("数组越界异常: " + e.getMessage());
} catch (Exception e) {
    System.out.println("其他异常: " + e.getMessage());
}
//注意：捕获顺序很重要！！！，子类异常必须放在父类异常上面，因为父类在上面会优先匹配，则下面更精确的子类异常则会匹配不到了
```

```java [多异常捕获（java7）]
try {
// 可能抛出多种异常的代码
int result = 10 / 0;
        String str = null;
        int length = str.length();
        int[] arr = new int[5];
        int num = arr[10];
} catch (ArithmeticException | NullPointerException e) {
        System.out.println("算术或空指针异常: " + e.getMessage());
        } catch (ArrayIndexOutOfBoundsException e) {
        System.out.println("数组越界异常: " + e.getMessage());
        }
        
//ps:主要用于多个异常共享相同的处理逻辑
```
:::

#### 异常常用方法

```java
   try {
            int result = 10 / 0; // 抛出 ArithmeticException
        } catch (ArithmeticException e) {
            // 获取异常信息
            System.out.println("异常消息: " + e.getMessage()); // / by zero
            System.out.println("异常类名: " + e.getClass().getName()); // java.lang.ArithmeticException
            System.out.println("异常字符串表示: " + e.toString()); // java.lang.ArithmeticException: / by zero

            // 打印堆栈跟踪（推荐常用）
            //注意此方法调用只是输出错误，不会停止运行        
            e.printStackTrace();
                /* 输出:
                java.lang.ArithmeticException: / by zero
                    at ExceptionMethodsDemo.main(ExceptionMethodsDemo.java:5)
                */
        }
```

#### 抛出异常

:::code-group
```java [运行时异常]
public class RuntimeExample {
    public static void checkNumber(int number) {
        if (number < 0) {
            // 抛出非检查型异常（RuntimeException子类）
            throw new IllegalArgumentException("数字不能为负数: " + number);
        }
        System.out.println("数字有效: " + number);
    }

    public static void main(String[] args) {
        checkNumber(10);  // 正常执行
        checkNumber(-5);  // 抛出异常
    }
}

```

```java [编译时异常]
import java.io.IOException;

public class CheckedExceptionExample {
    // 编译时异常必须在方法签名中声明检查型异常
    public static void readConfig(String filePath) throws IOException {
        if (filePath == null) {
            // 抛出检查型异常（必须声明或捕获）
            throw new IOException("配置文件路径不能为null");
        }
        // 实际读取配置文件的代码...
    }

    public static void main(String[] args) {
        try {
            readConfig(null);  // 强制要求处理异常
        } catch (IOException e) {
            System.err.println("配置读取失败: " + e.getMessage());
        }
    }
}
```
```java [自定义异常抛出]
// 自定义检查型异常
class InsufficientBalanceException extends Exception {
public InsufficientBalanceException(double amount) {
super("余额不足，需要金额: " + amount);
}
}

public class BankAccount {
private double balance;

    public BankAccount(double initialBalance) {
        this.balance = initialBalance;
    }

    public void withdraw(double amount) throws InsufficientBalanceException {
        if (amount > balance) {
            // 抛出自定义检查型异常
            throw new InsufficientBalanceException(amount - balance);
        }
        balance -= amount;
        System.out.println("取款成功，剩余余额: " + balance);
    }

    public static void main(String[] args) {
        BankAccount account = new BankAccount(1000);
        
        try {
            account.withdraw(500);   // 成功
            account.withdraw(800);   // 抛出异常
        } catch (InsufficientBalanceException e) {
            System.err.println("交易失败: " + e.getMessage());
        }
    }
}
```
:::

:::warning 注意
- **编译时异常**必须在方法签名中进行异常声明，运行时异常则不需要
:::

## File

:::code-group
```java  [java.io.File]
import java.io.File;
import java.io.IOException;

public class FileExample {
    public static void main(String[] args) {
        // 创建File对象
        File file = new File("test.txt");
        //绝对路径
        File file1 = new File("C:\\dir\\test.txt");
        //父路径+子路径自动拼接
        File file2 = new File("C:\\dir","test.txt");        try {
            // 创建新文件
            if (file.createNewFile()) {
                System.out.println("文件创建成功: " + file.getAbsolutePath());
            } else {
                System.out.println("文件已存在");
            }
            
            // 检查是否是目录
            System.out.println("是目录吗? " + file.isDirectory());
            
            // 获取文件信息
            System.out.println("文件大小: " + file.length() + " 字节");
            
            // 重命名文件
            File newFile = new File("renamed.txt");
            if (file.renameTo(newFile)) {
                System.out.println("重命名成功");
            }
            
            // 删除文件
            //默认只能删除文件或空文件夹，删除文件夹及其内容则需要递归删除
            if (newFile.delete()) {
                System.out.println("删除成功");
            }

            //获取某目录下所有文件（夹）并遍历
            File[] files = file1.listFiles();
            for (File file : files) {
                System.out.println(file.getName());
            }
            
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```
```java [java.nio.file]
import java.nio.file.*;
import java.io.IOException;
import java.util.List;

public class NioFileExample {
    public static void main(String[] args) {
        Path path = Paths.get("example.txt");
        
        try {
            // 创建文件并写入内容
            Files.write(path, "Hello, NIO.2!".getBytes(), StandardOpenOption.CREATE);
            
            // 读取文件内容
            List<String> lines = Files.readAllLines(path);
            System.out.println("文件内容: " + lines);
            
            // 复制文件
            Path dest = Paths.get("copy.txt");
            Files.copy(path, dest, StandardCopyOption.REPLACE_EXISTING);
            
            // 获取文件属性
            System.out.println("大小: " + Files.size(path));
            System.out.println("最后修改时间: " + Files.getLastModifiedTime(path));
            
            // 遍历目录
            Path dir = Paths.get(".");
            Files.list(dir).forEach(p -> System.out.println(p.getFileName()));
            
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```
:::warning 注意事项

- 使用 FileInputStream、FileOutputStream 等流时，必须确保关闭（使用 try-with-resources）
- 不同`操作系统`路径分隔符不同（Windows \，Unix /）
- 大量文件操作时，NIO.2 API (java.nio.file) 通常性能更好
- 文件操作可能抛出 IOException 或 SecurityException
- 处理大文件时考虑使用缓冲流
:::

## IO

IO流可用于读写文件中的内部数据（本地文件或网络文件），而File是做不到的。

按照流向可分为：

- **输入流**：从源（如文件）读取数据到程序中
- **输出流**：将程序中获取的文件数据向目标（如文件）写入数据

按照操作文件的类型可分为：

- **字节流**：可处理二进制数据等所有文件类型，如图片、音频、视频等

```java 

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;


//复制文件
public class ByteStreamExample {
    public static void main(String[] args) {
        try (FileInputStream fis = new FileInputStream("input.jpg");
             FileOutputStream fos = new FileOutputStream("output.jpg")) {

            byte[] buffer = new byte[1024];
            int len;
            while ((len = fis.read(buffer)) != -1) { // [!code error]
                fos.write(buffer, 0, len);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

- **字符流**：处理文本数据，如txt、xml、json等

```java
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

//读写文本文件
public class CharStreamExample {
    public static void main(String[] args) {
        try (BufferedReader reader = new BufferedReader(new FileReader("input.txt"));
             BufferedWriter writer = new BufferedWriter(new FileWriter("output.txt"))) {

            String line;
            while ((line = reader.readLine()) != null) { // [!code error]
                writer.write(line);
                writer.newLine(); // 写入换行
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

| 类型 | 基类 | 常见子类 | 用途 |
|------|------|--------|------|
| 字节输入流 | `InputStream` | `FileInputStream`, `BufferedInputStream`, `ObjectInputStream` | 读取二进制数据 |
| 字节输出流 | `OutputStream` | `FileOutputStream`, `BufferedOutputStream`, `ObjectOutputStream` | 写入二进制数据 |
| 字符输入流 | `Reader` | `FileReader`, `BufferedReader`, `InputStreamReader` | 读取文本 |
| 字符输出流 | `Writer` | `FileWriter`, `BufferedWriter`, `OutputStreamWriter` | 写入文本 |






:::warning 注意事项

- **所有 IO 流操作都需要处理异常**，如文件不存在、权限不足、IO 错误等。

- **所有打开的流必须关闭**，否则可能导致资源泄漏。推荐使用 **try-with-resources** 语法自动关闭。

- **使用字符流时务必注意编码格式（如 UTF-8、GBK）**，尤其是在跨平台或处理中文时。建议显式指定编码，避免依赖系统默认编码。

- **不要混用字节流和字符流操作同一文件**，可能因编码不一致导致乱码。

- **避免在循环中频繁创建/关闭流**,应在操作开始前打开流，结束后统一关闭。

- 对于大文件，应使用缓冲区（如 `byte[8192]`）而非一次性读入全部内容，防止内存溢出。

- 对于高并发、高性能场景（如服务器），建议使用 `java.nio`（如 `FileChannel`、`Selector` 等），传统 IO 是阻塞式的。

:::


