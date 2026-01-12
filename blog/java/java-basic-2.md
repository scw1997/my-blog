# Java高级

## 集合

Java集合框架是一组**用于存储和操作对象**的接口和实现类，位于java.util包中。它提供了多种数据结构实现，如列表、集合、队列和映射等。


Java 集合框架主要由以下几大接口构成：

#### `Collection` 接口

- 是所有单值集合的根接口。
- 包含add()，clear(),remove(),contains(),isEmpty(),size()等通用方法
- 主要**子接口**包括：
  - **`List`**：有序、可重复（允许 null），支持按索引访问。
    - 常见实现类：`ArrayList`、`LinkedList`、`Vector`
  - **`Set`**：无序（部分实现有序）、不可重复（最多一个 null）。
    - 常见实现类：`HashSet`、`LinkedHashSet`、`TreeSet`
  - **`Queue`**：通常用于 FIFO（先进先出）或优先级队列。
    - 常见实现类：`LinkedList`、`PriorityQueue`、`ArrayDeque`

####  `Map` 接口（虽然不属于 `Collection`，但属于集合框架）
- 存储键值对（key-value pairs），键不可重复（最多一个 null 键），值可以重复。
- 包含put()，remove(),clear(),containsKey()等通用方法
- 常见实现类：
  - `HashMap`：无序，高性能
  - `LinkedHashMap`：按插入顺序或访问顺序维护
  - `TreeMap`：按键的自然顺序或自定义比较器排序
  - `Hashtable`：线程安全但已过时（推荐用 `ConcurrentHashMap`）


| 集合类型      | 是否有序 | 是否允许重复 | 是否线程安全 | 底层结构        |
|---------------|--------|--------------|--------------|----------------|
| `ArrayList`   | 是     | 是           | 否           | 动态数组       |
| `LinkedList`  | 是     | 是           | 否           | 双向链表       |
| `HashSet`     | 否     | 否           | 否           | 哈希表         |
| `LinkedHashSet`| 是（插入顺序）| 否      | 否           | 哈希表 + 链表  |
| `TreeSet`     | 是（排序）| 否          | 否           | 红黑树         |
| `HashMap`     | 否     | 键不重复      | 否           | 哈希表         |
| `LinkedHashMap`| 是（插入/访问顺序）| 键不重复 | 否       | 哈希表 + 链表  |
| `TreeMap`     | 是（按键排序）| 键不重复   | 否           | 红黑树         |

选择思路：

- 需要**保持插入顺序且去重** → `LinkedHashSet`
- 需要**自动排序** → `TreeSet` / `TreeMap`
- 高频**随机访问** → `ArrayList`
- 高频**头尾插入/删除** → `LinkedList` 或 `ArrayDeque`
- 多线程环境 → 使用 `java.util.concurrent` 包中的并发集合




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

特点：**线程安全；防止调用方意外修改集合内容；适合定义常量**

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

        // 5. Map内部超过 10 对用 Map.ofEntries()
        Map<String, Integer> largeMap = Map.ofEntries(
            Map.entry("X", 100),
            Map.entry("Y", 200),
            Map.entry("Z", 300)
        );
        System.out.println("大型不可变Map: " + largeMap); // {X=100, Y=200, Z=300}
      
    }
}
```

:::warning 注意
- 元素必须唯一（Set 和 Map 的 key 不能重复）。不支持 null 元素。
- Map.of() 最多支持 10 个键值对（超过需用 Map.ofEntries()）。
- 返回的是 java.util.ImmutableCollections 内部类，非 ArrayList/HashMap。
:::

### Stream流

Stream API 是 Java 8 引入的一个强大的函数式数据处理特性，它提供了一种高效且易于理解的方式来处理`集合`数据。


Stream的创建方式
```java
// 1. 从集合创建
List<String> list = Arrays.asList("a", "b", "c");
Stream<String> stream1 = list.stream();

// 2. 从数组创建
String[] arr = {"x", "y", "z"};
Stream<String> stream2 = Arrays.stream(arr);

// 3. 使用 Stream.of()
Stream<Integer> stream3 = Stream.of(1, 2, 3, 4);

// 4. 生成无限流（需配合 limit）
Stream<Integer> infinite = Stream.iterate(0, n -> n + 2); // 0, 2, 4, 6...
Stream<Double> randoms = Stream.generate(Math::random);    // 随机数流
```

#### 常用操作分类

#### 中间操作
返回一个新的 Stream，可链式调用。

| 方法 | 说明 |
|------|------|
| `filter(Predicate<T>)` | 过滤满足条件的元素 |
| `map(Function<T, R>)` | 将元素转换为另一种类型 |
| `flatMap(Function<T, Stream<R>>)` | 扁平化嵌套结构（如 List> → List） |
| `sorted()` / `sorted(Comparator)` | 排序 |
| `distinct()` | 去重 |
| `limit(long n)` | 截取前 n 个元素 |
| `skip(long n)` | 跳过前 n 个元素 |
| `peek(Consumer<T>)` | 调试用，对每个元素执行操作（不影响流） |

#### 终止操作
触发流的执行，并产生结果或副作用。

| 方法 | 说明 |
|------|------|
| `forEach(Consumer<T>)` | 遍历每个元素 |
| `collect(Collector<T, A, R>)` | 将结果收集到集合、字符串等（最常用！） |
| `reduce(BinaryOperator<T>)` | 归约操作（如求和、拼接） |
| `count()` | 返回元素数量 |
| `min(Comparator)` / `max(Comparator)` | 求最小/最大值 |
| `anyMatch(Predicate)` / `allMatch(Predicate)` / `noneMatch(Predicate)` | 判断是否满足条件 |
| `findFirst()` / `findAny()` | 返回 Optional |

:::warning 注意
从java9开始，`count()` 对无状态、无副作用的流做了优化：

>如果 Stream 能够在不遍历元素的情况下确定元素数量（比如源是 Collection），那么 count() 可能直接返回 source.size()，而完全跳过中间操作（如 map、filter）！

```java
List<String> list = Arrays.asList("1","2","3");
Stream<String> s = list.stream();
Stream<String> s2 = s.map((ss)->{
    System.out.print("xxx"); //java9+不执行此行代码
    return "1";
});
long num = s2.count(); //触发流执行，但因map操作无副作用，count()可能直接返回list.size()而不执行map操作
```
:::

操作示例：

:::code-group
```java [筛选，转换，收集]
List<String> names = Arrays.asList("Alice", "Bob", "Charlie", "David");

List<String> result = names.stream()
        .filter(name -> name.length() > 3)     // 筛选长度 > 3
        .map(String::toUpperCase)              // 转大写
        .sorted()                              // 排序
        .collect(Collectors.toList());         // 收集为 List

// 结果: ["ALICE", "CHARLIE", "DAVID"]
```
```java [求和]
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);

int sum = numbers.stream()
    .mapToInt(Integer::intValue)  // 转为 IntStream（避免装箱）
    .sum();

// 或直接：
int sum2 = numbers.stream().reduce(0, Integer::sum);
```
```java [分组]
List<Person> people = ...;

Map<String, List<Person>> byCity = people.stream()
    .collect(Collectors.groupingBy(Person::getCity));
```
:::

:::warning 注意
- Stream 只能消费一次;
  ```java
  Stream<String> s = list.stream();
  s.forEach(System.out::println);
  s.count(); // ❌ 报错：stream has already been operated upon or closed
  ```
- Map（双列集合）不能直接使用stream，可通过`keySet()或entrySet()`间接返回单列集合来操作stream
- 如果没有终止操作，整个stream流不会运行
:::
## 泛型

泛型用于在编译期提供`类型安全`和`代码复用`能力。




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

:::warning 注意
- 泛型不能传递基本数据类型（但可以是基本类型的**包装类型**，如Integer、Character等）
- 泛型类型确定后，可以传递该类型以及其子类类型
- 不能创建泛型数组，如`T[] arr = new T[10]`是错误的。
- 静态成员不能使用类的泛型参数
  ```java
  public class Box<T> {
    private static T value; // ❌ 错误！static 属于类，与 T 无关
  }
  ```
- 不写泛型，默认就是`Object`
- 泛型不具备继承性（不支持多态），但是数据支持继承性
- 
:::

#### 常见泛型命名约定

| 字母 | 含义 |
|------|------|
| `T`  | Type（类型） |
| `E`  | Element（集合元素） |
| `K`  | Key（键） |
| `V`  | Value（值） |
| `N`  | Number（数字） |
| `S`, `U`, `V` | 第二、第三、第四个类型 |

例如：
```java
Map<K, V>
List<E>
Function<T, R>
```

#### 泛型通配符

无界通配符`?` ：表示为止类型常用于方法参数或返回值，提高灵活性。

上界通配符`? extends T`：表示该类型是 T 或其子类。

下界通配符`? super T`：表示该类型是 T 或其父类。

:::code-group
```java [无界通配符]
public void printList(List<?> list) {
  for (Object obj : list) {
    System.out.println(obj);
  }
}
// 可接受 List<String>, List<Integer> 等
```
```java [上界通配符]
public double sum(List<? extends Number> numbers) {
    double total = 0;
    for (Number n : numbers) {
        total += n.doubleValue();
    }
    return total;
}

// 可传入：List<Integer>, List<Double> 等
```
```java [下界通配符]
public void addNumbers(List<? super Integer> list) {
    list.add(100); // OK！因为 Integer 是 ? 的子类型
    list.add(200);
}
```
:::

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



**检查型异常**：

编译阶段就会报错，直接继承于`Exception`

例如：IOException, SQLException

**非检查型异常**：

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
- `捕获多异常`时，异常变量e为final，不能被重新赋值
- finally语句中不要添加return，throw，break，continue等控制流语句，无法保证执行顺序
:::


#### try-with-resources（Java 7+）

当我们执行资源处理相关逻辑时比如文件操作、数据库连接、网络连接等等，通常需要添加异常捕获和手动关闭资源等逻辑。

:::code-group
```java [传统写法]
FileInputStream fis = null;
try {
    fis = new FileInputStream("file.txt");
    // 读取文件...
} catch (IOException e) {
    e.printStackTrace();
} finally {
    if (fis != null) {
        try {
            fis.close(); // 手动关闭
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
//这段代码冗长、易错，且容易忘记关闭资源。
```
```java [try-with-resources]
import java.io.*;

public class TryWithResourcesExample {
  public static void main(String[] args) {
      //多个资源用分号分割
    try (FileInputStream fis = new FileInputStream("input.txt");
         BufferedReader reader = new BufferedReader(new InputStreamReader(fis))) {

      String line;
      while ((line = reader.readLine()) != null) {
        System.out.println(line);
      }

    } catch (IOException e) {
      System.err.println("读取文件时出错: " + e.getMessage());
    }
    // fis 和 reader 会自动关闭！
  }
}
```
:::

:::warning 注意
- 优先使用 try-with-resources 管理所有实现了 AutoCloseable接口（未实现则无效） 的资源。
- 不要手动在 try-with-resources 中调用 close()。即使出现异常，仍然会自动关闭。
- 捕获具体异常类型，而非泛化的 Exception。
:::

## 日志

#### 内置日志系统

日志信息级别从高到低为：**SEVERE > WARNING > INFO > CONFIG > FINE > FINER > FINEST**

:::code-group
```java [基本使用]

import java.util.logging.Logger;
import java.util.logging.Level;

public class Main {
    //创建一个日志记录器，命名可选择类名或包名
    private static final Logger logger = Logger.getLogger(Main.class.getName());//或com.xx.xxx

    public  static void main(String[] args) {
        logger.log(Level.SEVERE,"Starting operation...");
        try {
            // some logic
        } catch (Exception e) {
            //默认情况下，日志输出级别为INFO。所以SEVERE,WARNING，INFO才会输出信息，其他不会输出
            logger.warning("Operation failed");
            logger.severe("Operation failed");
            logger.info("Operation failed");
        }
    }
}
```
```java [调整日志级别]
import java.util.logging.*;

public class Main {
    public static void main(String[] args) {
        Logger logger = Logger.getLogger(Main.class.getName());

        // 获取控制台处理器（ConsoleHandler）
        ConsoleHandler handler = new ConsoleHandler();
        handler.setLevel(Level.FINE); // 设置处理器级别为 FINE

        // 设置 Logger 的级别
        logger.setLevel(Level.FINE);

        // 移除默认的 handler
        logger.setUseParentHandlers(false);
        logger.addHandler(handler);

        // 测试日志
        logger.info("INFO 日志");
        logger.fine("FINE 日志");     // 现在FINE级别消息也会打印了！
        logger.finer("FINER 日志");
    }
}
```
:::tip 技巧
- 修改日志级别时，必须同时设置 Logger 和 Handler 的级别才能生效。
- 开发阶段可设置日志级别为`FINE`(替换System.out.print)，便于调试。生产环境则设置为`INFO` 或 `WARNING`。

:::

#### SLF4J + Logback(主流推荐)

日志级别从低到高：**TRACE < DEBUG < INFO < WARN < ERROR < FATAL**

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Main {
    private static final Logger logger = LoggerFactory.getLogger(Main.class);
    //
    public static void main(String[] args) {
        logger.info("使用 SLF4J + Logback 记录日志");
        logger.debug("用户 {} 登录成功", "张三"); // 支持占位符，避免字符串拼接开销
    }
}
```

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

- 不同`操作系统`路径分隔符不同（Windows \，Unix /）
- 大量文件操作时，NIO.2 API (java.nio.file) 通常性能更好
- 文件操作可能抛出 IOException 或 SecurityException
:::

## IO流

 **I/O 流（Input/Output Streams）** 是 Java 用于处理**输入与输出操作**的核心机制，主要用于在程序与外部资源（如文件、网络、内存、控制台等）之间传输数据。
 
I/O 流位于 `java.io` 包中（传统 I/O），Java 1.4 起还引入了更高效的 **NIO（New I/O，`java.nio` 包）**。


#### 字节流

| 输入流（读） | 输出流（写） | 用途 |
|-------------|-------------|------|
| `FileInputStream` | `FileOutputStream` | 读写文件（字节） |
| `ByteArrayInputStream` | `ByteArrayOutputStream` | 读写内存字节数组 |
| `BufferedInputStream` | `BufferedOutputStream` | 带缓冲，提高性能 |
| `DataInputStream` | `DataOutputStream` | 读写基本数据类型（int, double 等） |
| `ObjectInputStream` | `ObjectOutputStream` | 序列化/反序列化对象 |

#### 字符流

| 输入流（读） | 输出流（写） | 用途 |
|-------------|-------------|------|
| `FileReader` | `FileWriter` | 读写文本文件（使用平台默认编码） |
| `InputStreamReader` | `OutputStreamWriter` | **桥接字节流与字符流**，可指定编码（如 UTF-8） |
| `BufferedReader` | `BufferedWriter` | 带缓冲的字符流，支持 `readLine()` |
| `StringReader` | `StringWriter` | 读写字符串 |
| `PrintWriter` | — | 格式化输出（类似 `System.out.println`） |

> 注意：`FileReader`/`FileWriter` **不能指定编码**！推荐用：
> ```java
> new InputStreamReader(new FileInputStream("file.txt"), "UTF-8")
> ```


#### 典型使用示例

:::code-group

```java [读取文本文件]
try (BufferedReader reader = new BufferedReader(
        new InputStreamReader(
            new FileInputStream("input.txt"), 
            StandardCharsets.UTF_8
        )
    )) {
    String line;
    while ((line = reader.readLine()) != null) {
        System.out.println(line);
    }
} catch (IOException e) {
    e.printStackTrace();
}
```


```java [写入文本文件]
try (BufferedWriter writer = new BufferedWriter(
        new OutputStreamWriter(
            new FileOutputStream("output.txt"),
            StandardCharsets.UTF_8
        )
    )) {
    writer.write("Hello, Java IO!");
    writer.newLine();
} catch (IOException e) {
    e.printStackTrace();
}
```


```java  [复制二进制文件]
try (FileInputStream in = new FileInputStream("src.jpg");
     FileOutputStream out = new FileOutputStream("dest.jpg")) {

    byte[] buffer = new byte[8192]; // 8KB 缓冲
    int len;
    while ((len = in.read(buffer)) != -1) {
        out.write(buffer, 0, len);
    }
} catch (IOException e) {
    e.printStackTrace();
}
```

```java [对象序列化]
// 写入
try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("obj.dat"))) {
    //`Person` 必须实现 `Serializable` 接口。
    oos.writeObject(new Person("Alice", 30));
        
        
        
}

// 读取
try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream("obj.dat"))) {
    Person p = (Person) ois.readObject();
}
```
:::

#### NIO vs IO

| 特性 | 传统 IO（`java.io`） | NIO（`java.nio`） |   |
|------|---------------------|------------------|---|
| 模型 | 阻塞式（Blocking） | 非阻塞 + 通道（Channel）+ 缓冲区（Buffer） |   |
| 性能 | 适合小文件、简单场景 | 适合高并发、大文件（如服务器） |   |
| 使用难度 | 简单直观 | 较复杂 |   |
| 关键类 | `InputStream`, `Reader` | `FileChannel`, `ByteBuffer`, `Path`, `Files` |   |

> 对于大多数文件读写任务，传统 IO + try-with-resources 已足够。

---

:::tip 选择技巧
- 文本 → 用 `Reader/Writer` + 指定编码
- 二进制 → 用 `InputStream/OutputStream`
- 性能 → 加 `Buffered` 包装
- 安全 → 用 try-with-resources 自动关闭
- 对象持久化 → 用 `ObjectInputStream/ObjectOutputStream`
:::


:::warning 注意事项

- **所有 IO 流操作都需要处理异常**，如文件不存在、权限不足、IO 错误等。

- **所有打开的流必须关闭**，否则可能导致资源泄漏。推荐使用 **try-with-resources** 语法自动关闭。

- **使用字符流时务必注意编码格式（如 UTF-8、GBK）**，尤其是在跨平台或处理中文时。建议显式指定编码，避免依赖系统默认编码。

- **不要混用字节流和字符流操作同一文件**，可能因编码不一致导致乱码。

- **避免在循环中频繁创建/关闭流**,应在操作开始前打开流，结束后统一关闭。

- 对于大文件，应使用缓冲区（如 `byte[8192]`）而非一次性读入全部内容，防止内存溢出。

- 对于高并发、高性能场景（如服务器），建议使用 `java.nio`（如 `FileChannel`、`Selector` 等），传统 IO 是阻塞式的。

:::


## 进程与线程

### 进程
- **定义**：进程是操作系统分配资源的基本单位，是一个正在运行的程序的实例。
- **特点**：
  - 每个进程有独立的内存空间（堆、栈、代码段等）。
  - 进程之间相互隔离，一个进程崩溃通常不会影响其他进程。
  - 创建和销毁进程开销较大（需要分配/回收内存、文件句柄等资源）。
- **示例**：启动一个 Java 应用（`java MyApp`）就是一个独立的 JVM 进程。

早期 Java 只能通过 Runtime.exec() 或 ProcessBuilder启动外部进程，但控制能力有限。**Java 9 引入了 `ProcessHandle` API**，大大增强了进程管理能力。

示例：启动并监控外部进程

```java
// 启动一个外部命令（如 ping）
ProcessBuilder pb = new ProcessBuilder("ping", "baidu.com");
Process process = pb.start();

// 获取进程信息（Java 9+）
ProcessHandle handle = process.toHandle();
System.out.println("PID: " + handle.pid());
System.out.println("Is alive: " + handle.isAlive());

// 等待进程结束
process.waitFor();
```

### 线程
- **定义**：线程是 CPU 调度的基本单位，是进程内的执行路径。
- **特点**：
  - 同一进程内的多个线程共享该进程的内存空间（如堆、方法区），但每个线程有自己的栈。
  - 线程创建和切换开销小，适合高并发任务。
  - 线程间通信方便（可直接读写共享变量），但也需注意**线程安全**问题（如竞态条件、死锁）。

> Java 程序默认至少有两个线程：main 主线程 和 垃圾回收线程（GC Thread）。


#### 创建线程的两种方式
:::code-group

```java [继承Thread类]
class MyThread extends Thread {
    public void run() {
        System.out.println("Thread running: " + Thread.currentThread().getName());
    }
}
// 使用(注意：必须调用 start()，不是 run())
new MyThread().start(); 


//java8+可使用lambda表达式简化上述代码
new Thread(() -> {
        System.out.println("Thread running: " + Thread.currentThread().getName());
        }).start();
```
```java [实现Runnable接口（推荐）]
class MyTask implements Runnable {
    @Override
    public void run() {
        System.out.println("Task running in: " + Thread.currentThread().getName());
    }
}

// 使用
Thread t = new Thread(new MyTask());
t.start();

//java8+可使用lambda表达式简化上述代码
Runnable task = () -> System.out.println("Running in: " + Thread.currentThread().getName());
new Thread(task).start();
```
:::

> 推荐使用 `Runnable`：避免了Thread使用时的单继承限制，更符合“组合优于继承”原则。

:::tip 为什么是调用start()而不是run()？

调用run()只是在当前线程（比如 main 线程）中执行 run() 方法体，不会并发执行，程序仍然是单线程的。

而调用start()后，JVM会为这个线程分配独立的虚拟机栈，将线程状态从 NEW 变为 RUNNABLE，在新线程的上下文中，自动调用该对象的 run() 方法
:::

#### 线程的生命周期
| 状态 | 说明 |
|------|------|
| `NEW` | 线程刚创建，尚未启动（`start()` 未调用） |
| `RUNNABLE` | 正在 JVM 中运行或等待 CPU 时间片（包括就绪和运行） |
| `BLOCKED` | 等待获取监视器锁（如进入 synchronized 块时被阻塞） |
| `WAITING` | 无限期等待其他线程显式唤醒（如 `wait()`, `join()`, `LockSupport.park()`） |
| `TIMED_WAITING` | 有超时的等待（如 `sleep(1000)`, `wait(1000)`, `parkNanos()`） |
| `TERMINATED` | 线程执行完毕或异常终止 |


#### 线程池
手动创建线程开销大、难管理。Java 提供线程池统一管理
```java
ExecutorService executor = Executors.newFixedThreadPool(4);
executor.submit(() -> {
    System.out.println("Task executed by: " + Thread.currentThread().getName());
});
executor.shutdown();
```

常见线程池类型：

| 方法 | 特点 |
|------|------|
| `newFixedThreadPool(n)` | 固定大小线程池 |
| `newCachedThreadPool()` | 弹性线程池（空闲线程60秒回收） |
| `newSingleThreadExecutor()` | 单线程顺序执行 |
| `newScheduledThreadPool()` | 支持定时/周期任务 |


#### 线程安全


#### 对比

| 特性 | 进程（Process）                                               | 线程（Thread） |
|------|-----------------------------------------------------------|----------------|
| 内存空间 | 独立                                                        | 共享（同进程内） |
| 创建开销 | 大                                                         | 小 |
| 通信方式 | IPC（管道、Socket、文件等）                                        | 直接共享变量（需同步） |
| 安全性 | 高（隔离性强）                                                   | 低（需处理并发问题） |
| 切换成本 | 高                                                         | 低 |
| Java 支持 | `ProcessBuilder`, `ProcessHandle`（Java 9+）                | `Thread`, `ExecutorService`, 并发包 |
|应用场景| 多进程：<br/>Java 主程序调用 MATLAB 进行数值计算<br/>启动独立的监控代理进程（如日志收集器） |多线程：<br/>Web 服务器处理多个 HTTP 请求（Tomcat 使用线程池）。<br/>图像处理：并行解码多路视频流。


:::tip 总结
- **线程**是 Java 并发的核心，轻量、高效，适合 I/O 密集型和 CPU 并行任务。
- **进程**用于隔离、调用外部程序，在 Java 中主要用于与系统或其他语言交互。
- 现代 Java 应用通常以**多线程为主 + 必要时调用外部进程**的混合模式运行。
:::

### 线程安全（锁）

锁是用于控制多线程对共享资源访问的同步机制，目的是**防止多个线程同时修改共享数据**而导致数据不一致或竞态条件。


#### 内置锁（synchronized）

- 是 Java 最早提供的线程同步机制。
- 每个对象都有一个与之关联的**监视器锁（monitor）**。
- 可用于：
  - **方法级别**（实例方法或静态方法）
  - **代码块级别**

:::code-group
```java [基本用法]
// 方法级
public synchronized void method() {
    // 临界区
}

// 静态方法（锁的是类对象）
public static synchronized void staticMethod() {
    // 临界区
}

// 代码块级
synchronized (lockObject) {
    // 临界区
}
```

```java [场景示例]
//场景：多人排队上厕所
//解决方案：门口挂一把“正在使用”牌子（相当于 synchronized 锁）。
//第一个人进去，挂上牌子（加锁）。
//后面的人看到牌子，就在门口排队等（阻塞等待）。
//第一个人出来，摘下牌子（释放锁），下一个人进去。

public synchronized void useToilet() {
  // 上厕所（临界区）
}
```
:::

**特点**：
- 自动加锁/释放（进入时加锁，退出时自动释放，包括异常）
- 不可中断（无法响应 Thread.interrupt()）
- 不支持超时
- 不支持尝试获取锁（非阻塞）


#### 显式锁

JDK 1.5 引入了 `java.util.concurrent.locks` 包，提供了更灵活的锁机制。

> 默认情况下，优先推荐使用此包提供的线程同步方案，而不是synchronized

---
#### 1.ReentrantLock（可重入锁）
- 实现了 `Lock` 接口
- 功能比 synchronized 更强大

```java
//场景示例：热门图书只有一本，10 个人都想借
//等5分钟就去借，借不到就继续等5分钟再借。
//借了书的人必须还书才能被借

Lock bookLock = new ReentrantLock();

if (bookLock.tryLock(5, TimeUnit.MINUTES)) {
    try {
    // 借书、看书
    } finally {
     bookLock.unlock(); // 必须还书！
    }
}
```

特性：
- **可重入**：同一个线程可以多次获取同一把锁
- **可中断**：`lockInterruptibly()` 支持响应中断
- **可设置公平性**：构造函数可传 `fair=true`（默认是非公平）
- **支持尝试获取锁**：`tryLock()`、`tryLock(timeout, unit)`
- **支持 Condition**：替代 Object 的 wait/notify 机制

---
#### 2.ReadWriteLock（读写锁）
- 适用于“多读少写”场景
- 接口：`ReadWriteLock`
- 常用实现：`ReentrantReadWriteLock`

```java
//场景示例：一份 Excel 表格，多人要查看，偶尔有人要修改。
//多人可以同时读（看表格不影响别人看）
//但只要有人在写（修改），其他人都不能读也不能写
//写操作必须独占

ReadWriteLock rwLock = new ReentrantReadWriteLock();

// 读操作
rwLock.readLock().lock();
try { /* 查看数据 */ } finally { rwLock.readLock().unlock(); }

// 写操作
rwLock.writeLock().lock();
try { /* 修改数据 */ } finally { rwLock.writeLock().unlock(); }
```

:::warning 注意
- 多个读线程可同时持有读锁
- 写锁是独占的（排斥读和其他写）
- 读锁和写锁不能同时持有
:::


---
#### 3.StampedLock（JDK 8 引入）
- 性能优于 ReentrantReadWriteLock
- 支持三种模式：写、读、乐观读（optimistic read）
- **不是可重入的**
- 不支持 Condition
- **适合数据变更不频繁的场景**


场景示例：某商品价格大部分时间不变，小部分时间会被修改。现在需要对某商品进行读取价格结账

**传统方式：悲观读**
```java
ReadWriteLock rwLock = new ReentrantReadWriteLock();
// 悲观读：每次读都要加读锁来锁住价格，用来避免期间价格被修改
rwLock.readLock().lock();
try {
    return price; // 安全，但每次都要排队拿锁
} finally {
    rwLock.readLock().unlock();
}

//假如同时有1000用户购买此商品，则需要1000次加锁释放锁。会有性能问题
```

**StampedLock方式：乐观读 + 降级保护**
```java
public class PriceService {
 //volatile作用：让所有线程（写和读）看到同一个变量的最新值，并且按你写的顺序执行相关操作。   
  private volatile double price; // ⚠️ 必须 volatile！
  private final StampedLock sl = new StampedLock();

  // 写操作
  public void setPrice(double newPrice) {
    long stamp = sl.writeLock();
    try {
      this.price = newPrice; // 写入 volatile 字段
    } finally {
      sl.unlockWrite(stamp);
    }
  }

  // 读操作（乐观读 + 降级保护）
  public double getPrice() {
    long stamp = sl.tryOptimisticRead();     // 1. 尝试乐观读
    double currentPrice = this.price;        // 2. 读 volatile 价格字段

    if (!sl.validate(stamp)) {               // 3. 从乐观读操作到现在期间是否有写操作？
      stamp = sl.readLock();               // 4. 有写操作，则升级为悲观读。获取读锁，避免期间进行写操作
      try {
        currentPrice = this.price;       // 5. 重新读（此时有内存屏障）
      } finally {
        sl.unlockRead(stamp);            // 6. 释放读锁
      }
    }
    return currentPrice;
  }
}
//由于该商品价格被修改的概率较小，所以大部分时间都不会加读锁，优化了性能。
```
:::warning 注意
- `volatile`变量不能保证原子性（例如`i++`等计数累加操作如果遇到多个线程同时进行则无法保证值是期待的值。仍需 synchronized 或 AtomicInteger来控制执行顺序）
:::

#### 如何选择

| 场景 | 推荐 |
|------|------|
| 简单同步 | `synchronized`（简洁、安全） |
| 需要超时/中断/公平性 | `ReentrantLock` |
| 多读少写 | `ReentrantReadWriteLock` 或 `StampedLock` |
| 高并发短临界区 | 考虑 `synchronized`（JVM 优化好）或 `StampedLock` |



:::warning 注意事项
- 使用显式锁（如 ReentrantLock）**必须在 finally 块中释放锁**，否则可能死锁。
- 避免锁的粒度过大（影响并发）或过小（增加复杂度）。
- 尽量减少锁的持有时间。
- 警惕死锁：避免嵌套锁、按固定顺序获取多个锁。
:::

#### 乐观锁与悲观锁

#### 乐观锁：

**思想**：无锁读写，提交时检查是否被别人修改过

**适合场景**：读多写少或者写操作简单迅速（如网站点击量），数据变化频率低

**经典应用**：网站点击量（CAS高效），缓存配置获取（StampedLock乐观读）

CAS方式实现乐观锁：
```java

private AtomicInteger count = new AtomicInteger(0);

public void increment() {
    int current;
    do {
        current = count.get();          // 读当前值
      // 如果此时此刻count值还是current,则修改为我希望的值即current+1（即成功，跳出循环）；
      //否则说明count值不是current（被别人修改了），则重新获取最新count值再循环重来
      //CAS思想总结：我先记住现在的样子，然后验证如果它没变，我就把它改成我期待的样子；变了就获取最新样子再重复此逻辑
    } while (!count.compareAndSet(current, current + 1)); 
}
```

#### 悲观锁
**思想**：写时加锁，读写互斥

**适合场景**：写多读少，数据变化频繁

**经典应用**：限时秒杀库存，银行转账（使用synchronized）


## 模块
Java 的模块系统是 **Java 9（2017 年）** 引入的一项重大特性。

它的核心目标是：**让 Java 平台和应用程序具备更强的可维护性、安全性、性能和封装能力**。



#### 为什么需要模块

在 Java 9 之前，Java 只有 **类（class）→ 包（package）→ JAR 文件** 三层结构，存在严重问题：

##### **类路径地狱（Classpath Hell）**
- 所有 JAR 都扔到 classpath，JVM 不知道哪些类属于哪个逻辑组件。
- 依赖冲突、版本混乱（比如两个库依赖不同版本的 Guava）。

#####  **缺乏封装**
- `public` 类对所有其他代码可见，无法真正“隐藏内部实现”。
- 比如你用了 JDK 内部的 `sun.misc.Unsafe`，Oracle 一直想移除它，但太多人偷偷用了，不敢动！

##### **臃肿的 JDK**
- 即使你只写个 Hello World，也要加载整个 `rt.jar`（包含 Swing、CORBA 等无用模块）。
- 不利于微服务、容器化（镜像太大）。

---

####  模块的组成结构

模块 = **一组包 + 一个 module-info.java 描述文件**

```
my-app/
├── module-info.java   ← 模块描述文件（关键！）
├── com/example/main/
│   └── Main.java
└── com/example/util/
    └── Helper.java
```

核心：`module-info.java`
这是模块的“身份证”，声明：
- **模块名**
- **导出哪些包**（对外公开 API）
- **依赖哪些其他模块**
- **开放哪些包给反射**（可选）

```java
// module-info.java
module com.example.myapp {
    // 1. 导出包（只有被 exports 的包，外部模块才能访问）
    exports com.example.main;

    // 2. 依赖其他模块（requires）
    requires java.base;        // 所有模块默认依赖 java.base
    requires org.slf4j;        // 第三方日志模块

    // 3. 开放包给反射（比如 Spring 需要）
    opens com.example.util;
}
```

####  exports 和 opens 的区别
| 特性 | `exports` | `opens`                                     |
|------|----------|---------------------------------------------|
| 用途 | 允许其他模块正常编译和调用（如 `new MyClass()`） | 允许其他模块通过**反射**访问（如 `field.set(obj, value)`） |
| 访问级别 | 只能访问 `public` 类和成员 | 可访问 所有成员（包括 `private`、`protected`）          |
| 安全性 | 较高（只暴露 API） | 较低（暴露内部实现）                                  |
| 典型场景 | 提供公共 API | 支持依赖注入、序列化、测试等反射框架                          |



---

#### 模块的特性

| 特性 | 说明 | 举例 |
|------|------|------|
| **强封装（Strong Encapsulation）** | 未 `exports` 的包，**其他模块完全不可见**（连反射都默认禁止） | `com.example.internal` 没 exports → 别人无法使用 |
| **显式依赖（Explicit Dependencies）** | 必须用 `requires` 声明依赖，否则编译/运行时报错 | 忘了 `requires java.sql` → 用 `Connection` 就报错 |
| **可靠配置（Reliable Configuration）** | 启动时 JVM 会检查模块依赖是否完整，避免运行时 `NoClassDefFoundError` | 缺少依赖模块 → 启动直接失败，不等到运行时才崩 |
| **更小的运行时（Smaller Runtime）** | 可用 `jlink` 工具打包**只包含所需模块的 JRE** | 微服务镜像从 400MB → 50MB |



#### 类 vs 包 vs 模块

| 层级 | 作用 | 可见性控制 |
|------|------|-----------|
| **类（Class）** | 代码基本单元 | `private` / `protected` / `public` |
| **包（Package）** | 组织类 | 默认包内可见，`public` 全局可见（无限制）|
| **模块（Module）** | 组织包 + 声明依赖 | **只有 `exports` 的包才对外可见** ✅ |



:::tip 非模块化代码

Java 为了向后兼容，设计了 **“未命名模块（Unnamed Module）”**：

- 所有没有 `module-info.java` 的 JAR，会被放入 **同一个未命名模块**。
- 这个模块：
  - **能读取所有其他模块**（包括 JDK 模块）
  - **但自己的所有包都对外暴露**（像以前一样）
  - **不能被模块化代码直接依赖**（除非用 `--add-modules` 等参数）

> 所以老项目可以**逐步迁移**，不用一次性重写。
:::

####  模块场景

| 场景 | 好处 |
|------|------|
| **大型应用** | 清晰划分组件边界，避免“意大利面条式依赖” |
| **安全敏感系统** | 隐藏内部实现，防止误用或攻击（如禁止访问内部 API）|
| **微服务/容器** | 用 `jlink` 生成超小 JRE，加快启动、减少攻击面 |
| **库开发者** | 明确区分 public API 和 internal 实现，未来升级更安全 |


## Java虚拟机

Java虚拟机（JVM）它是一个抽象的计算引擎，负责加载、验证、执行 Java 字节码（bytecode），并管理内存、线程、安全等底层资源。

### 虚拟机的作用

- **跨平台运行**：

  Java 源代码（.java）通过调用`javac java文件名`被编译成与平台无关的字节码（.class 文件），由 JVM通过`java class文件名（不含后缀）` 在不同操作系统（Windows、Linux、macOS 等）上解释或编译执行。

- **自动内存管理**：
JVM 提供`垃圾回收（GC）机制`，自动回收不再使用的对象，避免内存泄漏和手动内存管理的复杂性。
- **安全性**：
JVM 提供字节码校验、类加载器隔离、安全管理器等机制，防止恶意代码破坏系统。
- **性能优化**:
通过 即时编译器（JIT, Just-In-Time Compiler）将热点代码编译为本地机器码，提升运行效率。

### 虚拟机组成结构


#### 1.类加载子系统

  负责将 .class 文件加载到内存，并生成对应的 Class 对象。

#### 2.运行时数据区

  这是 JVM 的`内存模型`，分为线程共享和线程私有区域：

##### （1）线程共享
    
- **方法区**：存储`class类结构信息、常量、静态变量`、即时编译器编译后的代码(.class文件)
- **堆**： 存放几乎所有`对象实例和数组`
##### （2）线程私有

- **虚拟机栈**：每个线程一个栈，存储栈帧（Stack Frame），包含局部变量表、操作数栈、动态链接、方法返回地址等。`方法调用 = 压栈，方法返回 = 出栈`。
- **本地方法栈**：用于执行 native 方法（如 C/C++ 代码）
- **程序计数器**：记录当前线程执行到哪一行代码

#### 3.执行引擎

负责执行字节码指令，由解释器, 即时编译器，垃圾回收器构成。

#### 4.本地方法接口

允许 Java 代码调用本地（如 C/C++）库，扩展 JVM 功能（如访问硬件、调用系统 API）。
#### 5.本地方法库
包含 JVM 使用的本地库（如 java.lang.System 的部分实现）。

### 虚拟机运行流程

```text
.java 源文件
     ↓ (javac 编译)
.class 字节码文件
     ↓ (java 命令启动 JVM)
JVM 启动 → 类加载器（ClassLoader）加载 .class
     ↓
链接（Linking）：
  ├─ 验证（Verification）→ 确保字节码安全合法
  ├─ 准备（Preparation）→ 为 static 变量分配内存并设默认值
  └─ 解析（Resolution）→ 将符号引用转为直接引用
     ↓
初始化（Initialization）→ 执行 static 代码块和 static 变量赋值
     ↓
执行引擎（Execution Engine）运行字节码
     ├─ 解释执行（Interpreter）
     ├─ 即时编译（JIT Compiler，如 C1/C2）
     └─ 本地方法接口（JNI）调用 C/C++ 代码
     ↓
程序运行结束（正常退出或异常终止）
```

1. **编译阶段**： 

   启用`javac`将.java源代码编译成.class字节码文件（非jvm流程，但是其起点）

2. **启动JVM**：

    启用`java`来启动JVM。创建`方法区、堆、栈`等运行时数据区并启动`类加载子系统`。

3. **类加载**：

   JVM通过类加载器将 .class 文件读入内存，并生成对应的 java.lang.Class 对象。

   | 步骤 | 作用 |
   |------|------|
   | 加载（Loading） | 1. 通过类全限定名找到 .class 文件<br>2. 读入字节流<br>3. 在方法区创建类的运行时表示<br>4. 在堆中创建 `Class` 对象 |
   | 链接（Linking） | 分三步：<br>① 验证：检查字节码是否安全（防恶意代码）<br>② 准备：为 `static` 变量分配内存，并设默认初始值（如 int=0, boolean=false）<br>③ 解析：将常量池中的符号引用（如 "java/lang/Object"）转为直接引用（内存地址） |
   | 初始化（Initialization） | 执行 `<clinit>` 方法：<br>- `static` 变量的显式赋值<br>- `static {}` 代码块<br>（按代码顺序执行） |

      :::tip 类加载的触发时机？
      以下操作会`触发类加载`：
      - 创建类实例（new）
      - 调用静态方法
      - 访问静态字段（非 final 常量）
      - 反射（Class.forName()）
      - 启动类（含 main 方法的类）
   
      以下操作`不会触发类加载`：
      - 访问 static final 常量（编译期已确定）
      - 子类引用父类静态字段（只初始化父类）
      - 定义数组（MyClass[] arr = new MyClass[10]）
      :::
4. **执行阶段**

字节码被 执行引擎（Execution Engine） 处理，主要有三种方式：
| 方式 | 说明 | 特点 |
|------|------|------|
| 解释执行 | 逐条翻译字节码为机器码执行 | 启动快，但慢（每条都翻译） |
| JIT 编译（即时编译器） | 热点代码（频繁执行）被编译为本地机器码并缓存 | 首次慢，后续极快（C2 编译器优化强） |
| JNI（本地方法接口） | 调用 C/C++ 编写的本地方法（如 `System.currentTimeMillis()`） | 绕过 JVM，直接调 OS |

> 现代 JVM（HotSpot）是 `解释 + JIT` 混合模式，兼顾启动速度和运行性能。

5. **内存管理（贯穿始终）**

| 区域 | 作用                      | 线程共享？ |
|------|-------------------------|-----------|
| 堆（Heap） | 存放对象实例、数组               | ✅ 共享 |
| 方法区（Metaspace） | 存放类信息、常量、static 变量      | ✅ 共享 |
| 虚拟机栈（VM Stack） | 每个方法调用创建一个栈帧（局部变量、操作数栈） | ❌ 线程私有 |
| 本地方法栈 | 为 JNI 服务(调用 C/C++ 编写的`本地方法`)              | ❌ |
| 程序计数器 | 记录当前线程执行的字节码行号          | ❌ |


6. **程序终止**

以下情况会触发程序终止：

- main() 方法执行完毕
- 调用 System.exit()
- 发生未捕获的异常
- JVM 销毁所有线程，释放内存，进程退出


### 虚拟机性能优化

#### **1. 选择合适的垃圾回收器（GC）**

| GC 类型 | 适用场景 | 启动参数 | 特点 |
|--------|--------|--------|------|
| **Serial GC** | 单核、小内存（如嵌入式） | `-XX:+UseSerialGC` | 单线程，STW 时间长 |
| **Parallel GC（默认）** | **高吞吐量**（后台计算、批处理） | `-XX:+UseParallelGC` | 多线程并行，吞吐高，停顿较长 |
| **CMS（已废弃）** | 低延迟（Web 应用） | `-XX:+UseConcMarkSweepGC` | 并发标记，但碎片多、退化风险高 |
| **G1 GC（推荐）** | **大堆（4GB+）、低延迟要求** | `-XX:+UseG1GC` | 分 Region 回收，可预测停顿时间 |
| **ZGC（Java 11+）** | 超低延迟（<10ms），堆可达 TB 级 | `-XX:+UseZGC` | 几乎无 STW，适合金融、实时系统 |
| **Shenandoah（OpenJDK）** | 类似 ZGC，Red Hat 主导 | `-XX:+UseShenandoahGC` | 低延迟，并发压缩 |

> 📌 **建议**：
> - 普通 Web 应用 → **G1**
> - 超低延迟系统 → **ZGC / Shenandoah**
> - 批处理任务 → **Parallel GC**



#### **2. 合理设置堆内存大小**

```bash
# 初始堆大小 = 最大堆大小（避免动态扩容开销）
-Xms4g -Xmx4g

# 新生代大小（通常占堆 1/3 ~ 1/2）
-XX:NewSize=1g -XX:MaxNewSize=1g
# 或用比例（G1 不推荐）
-XX:NewRatio=2  # 老年代:新生代 = 2:1
```

> 💡 **原则**：
> - `-Xms == -Xmx`：避免运行时扩容导致卡顿
> - 堆不是越大越好！过大会导致 GC 停顿变长（除非用 ZGC）

---

#### **3. G1 GC 关键参数调优（重点！）**

```bash
-XX:+UseG1GC
-Xms8g -Xmx8g

# 目标最大停顿时间（默认 200ms）
-XX:MaxGCPauseMillis=100

# 触发并发周期的堆占用阈值（默认 45%）
-XX:InitiatingHeapOccupancyPercent=35

# 并行 GC 线程数（默认 CPU 核数）
-XX:ParallelGCThreads=8
```

> **调优目标**：让 G1 在应用空闲时完成 Mixed GC，避免在高峰期 Full GC。

---

####  **4. 避免 Full GC**

Full GC 会导致**长时间 STW（Stop-The-World）**，必须避免！

常见原因 & 解决方案：

| 原因 | 解决方案 |
|------|--------|
| **老年代空间不足** | 增大堆、优化对象生命周期、减少大对象 |
| **元空间（Metaspace）溢出** | `-XX:MaxMetaspaceSize=256m`（避免无限增长） |
| **System.gc() 被调用** | 加 `-XX:+DisableExplicitGC` 禁用 |
| **G1 无法及时回收** | 调低 `IHOP`，增大并发线程数 |
| **大对象直接进入老年代** | 避免创建超大数组/集合，或调整 `-XX:PretenureSizeThreshold` |

---

#### 5. JIT 编译优化

JVM 的 **即时编译器（JIT）** 会将热点代码编译为本地机器码，大幅提升性能。

优化建议：
- **预热（Warm-up）**：服务启动后先跑一段时间再接入流量（让 JIT 编译完成）
- **避免过度动态性**：如频繁反射、动态代理会阻碍 JIT 优化
- **使用 final 方法/类**：帮助 JIT 内联（Inlining）
- **控制方法大小**：太大的方法不易被内联（默认 325 字节码）

> 🔧 可通过 `-XX:+PrintCompilation` 查看 JIT 编译日志。

---

#### 6. 启动参数优化（通用建议）

```bash
# 禁用显式 GC（防止 System.gc() 触发 Full GC）
-XX:+DisableExplicitGC

# 使用容器感知（Docker/K8s）
-XX:+UseContainerSupport  # JDK 8u191+ / JDK 10+

# 限制容器内存（避免 OOMKilled）
-XX:MaxRAMPercentage=75.0

# 关闭 JIT 分层编译（某些场景可提速启动）
-XX:-TieredCompilation

# 输出详细 GC 日志（用于分析）
-Xlog:gc*:file=gc.log:time,tags
```

> 🐳 **容器环境特别注意**：  
> 旧版 JVM 无法识别 Docker 内存限制，需手动设置 `-Xmx` 或启用 `UseContainerSupport`。


#### 7. 代码层面（配合 JVM）
 
| 问题 | 优化方式 |
|------|--------|
| **频繁创建短生命周期对象** | 对象复用（ThreadLocal、对象池） |
| **大对象分配** | 避免一次性 new 大数组，改用流式处理 |
| **字符串拼接** | 用 `StringBuilder` 代替 `+`（尤其在循环中） |
| **集合初始化容量** | `new ArrayList(1000)` 避免多次扩容 |
| **避免在循环中创建 Lambda/匿名类** | 可能导致 Metaspace 增长 |
| **合理使用缓存** | 减少重复计算，但注意内存泄漏 |

---

#### 8. 高级技巧（进阶）

**逃逸分析（Escape Analysis）**
JVM 自动判断对象是否“逃逸”出方法：
- 不逃逸 → 栈上分配（避免堆分配 + GC）
- 开启：`-XX:+DoEscapeAnalysis`（默认已开）

**压缩指针（Compressed Oops）**
- 64 位 JVM 中，用 32 位指针表示堆地址（节省内存）
- 默认开启（堆 < 32GB 时有效）

**虚拟线程（Project Loom，Java 21+）**
- 轻量级线程，极大提升 I/O 密集型应用吞吐量
- 减少线程上下文切换开销






### JDK/JRE/JVM关系
|名词|介绍|
|--|--|
|JDK|JDK是java开发工具包，包含了JVM虚拟机，核心类库和开发工具（java,javac等）。用于编写代码+运行程序。|
|JRE|JRE是java运行环境。包含了JVM虚拟机，核心类库和运行工具。如果只需要运行class文件，则只需要JRE即可。|
|JVM|JVM是虚拟机，为java程序真正运行的地方。|


