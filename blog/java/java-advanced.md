# Java高级

## 集合

Java集合框架是一组**用于存储和操作对象**的接口和实现类，位于java.util包中。它提供了多种数据结构实现，如列表、集合、队列和映射等。

**1. Collection（所有集合的根接口）**

包含add()，clear(),remove(),contains(),isEmpty(),size()等通用方法，包含以下三大子类：

`List（接口）`：有序集合，允许重复元素（如ArrayList、LinkedList）

`Set（接口）`：无序集合，不允许重复元素（如HashSet、TreeSet）

`Queue`：队列（如LinkedList、PriorityQueue）

**2. Map：键值对集合（如HashMap、TreeMap）**


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

#### 增强for循环

所有的`基于Collection的变量（List和Set）或者数组`可以使用增强for循环
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

```java [TreeSet]
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
:::tip 扩展
- HashSet 和 LinkedHashSet 允许一个 null 元素。TreeSet 不允许 null（因为无法比较排序）。
- 性能排序：HashSet > LinkedHashSet > TreeSet
:::
#### HashCode

Java中的所有对象示例都有一个方法hashCode()返回了该对象的哈希值,它代表的是对象的整数表现形式。

默认情况，hashCode方法是基于对象的地址值计算出哈希值，所以不同对象的hash值是不一样的。

> 但是极小部分情况下，不同的属性或者不同的地址值计算的哈希值有可能一样（哈希碰撞）

:::tip 为什么要重写 equals() 和 hashCode()

默认情况下，equals()是通过比较对象的地址值来判断两个对象是否相等，但是通常使用这个方法意义不大，因为除非是同一个对象否则该方法只返回false

通常我们会认为两个对象的各自的属性内容相同的话，就认为是同一个对象。所以此时要按照自己期望的规则重写equals方法。


**而当我们重写了equals方法后，在使用HashSet和HashMap时必须要重写hashCode方法**：

因为HashSet和HashMap在添加元素时会进行判断去重处理，会先判断HashCode()是否相等再通过equals()判断。假设此时我们重写了equals方法但没重写hashCode方法，并且依次添加了两个属性内容相同的对象元素。

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