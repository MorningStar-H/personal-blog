---
title: "反射与自定义特性完全指南"
date: "2025-07-01"
excerpt: "C# 反射与自定义特性"
subcategory: 'csharp'
category: "tech"
---


# C# 反射与自定义特性完全指南

## 📖 目录
- [反射概述](#反射概述)
- [反射的核心功能](#反射的核心功能)
- [自定义特性](#自定义特性)
- [实际应用示例](#实际应用示例)
- [性能考虑](#性能考虑)

## 反射概述

反射是 .NET 框架提供的一个强大功能，它允许程序在运行时检查、实例化和操作类型。通过反射，我们可以动态地获取类型信息、创建对象实例、调用方法等。

### 🔍 反射的主要命名空间
```csharp
using System;
using System.Reflection;
using System.Linq;
```

## 反射的核心功能

### 1. 📋 枚举类型的成员

```csharp
public class Person
{
    public string Name { get; set; }
    public int Age { get; set; }
    
    public void SayHello() => Console.WriteLine($"Hello, I'm {Name}");
    public void Celebrate(string occasion) => Console.WriteLine($"Celebrating {occasion}!");
}

// 获取类型信息
Type personType = typeof(Person);

// 枚举所有属性
PropertyInfo[] properties = personType.GetProperties();
foreach (var prop in properties)
{
    Console.WriteLine($"属性: {prop.Name}, 类型: {prop.PropertyType}");
}

// 枚举所有方法
MethodInfo[] methods = personType.GetMethods(BindingFlags.Public | BindingFlags.Instance | BindingFlags.DeclaredOnly);
foreach (var method in methods)
{
    Console.WriteLine($"方法: {method.Name}");
    foreach (var param in method.GetParameters())
    {
        Console.WriteLine($"  参数: {param.Name} ({param.ParameterType})");
    }
}
```

### 2. 🏗️ 实例化新对象

```csharp
// 方式一: 使用 Activator.CreateInstance
Type personType = typeof(Person);
object personInstance = Activator.CreateInstance(personType);
Person person = (Person)personInstance;

// 方式二: 使用构造函数
ConstructorInfo constructor = personType.GetConstructor(Type.EmptyTypes);
Person person2 = (Person)constructor.Invoke(null);

// 方式三: 泛型方式
T CreateInstance<T>() where T : new()
{
    return (T)Activator.CreateInstance(typeof(T));
}
```

### 3. 🎯 执行对象的成员

```csharp
Person person = new Person { Name = "张三", Age = 25 };
Type type = person.GetType();

// 获取和设置属性值
PropertyInfo nameProperty = type.GetProperty("Name");
string currentName = (string)nameProperty.GetValue(person);
nameProperty.SetValue(person, "李四");

// 调用方法
MethodInfo sayHelloMethod = type.GetMethod("SayHello");
sayHelloMethod.Invoke(person, null);

// 调用带参数的方法
MethodInfo celebrateMethod = type.GetMethod("Celebrate");
celebrateMethod.Invoke(person, new object[] { "生日" });
```

### 4. 🔍 查找类型的信息

```csharp
Type stringType = typeof(string);

Console.WriteLine($"类型名称: {stringType.Name}");
Console.WriteLine($"完整名称: {stringType.FullName}");
Console.WriteLine($"命名空间: {stringType.Namespace}");
Console.WriteLine($"是否为值类型: {stringType.IsValueType}");
Console.WriteLine($"是否为类: {stringType.IsClass}");
Console.WriteLine($"是否为接口: {stringType.IsInterface}");
Console.WriteLine($"是否为抽象: {stringType.IsAbstract}");
Console.WriteLine($"是否为密封: {stringType.IsSealed}");

// 获取基类
Type baseType = stringType.BaseType;
Console.WriteLine($"基类: {baseType?.Name}");

// 获取实现的接口
Type[] interfaces = stringType.GetInterfaces();
Console.WriteLine("实现的接口:");
foreach (var iface in interfaces)
{
    Console.WriteLine($"  {iface.Name}");
}
```

### 5. 📦 查找程序集的信息

```csharp
// 获取当前程序集
Assembly currentAssembly = Assembly.GetExecutingAssembly();
Console.WriteLine($"程序集名称: {currentAssembly.FullName}");
Console.WriteLine($"程序集位置: {currentAssembly.Location}");

// 获取程序集中的所有类型
Type[] types = currentAssembly.GetTypes();
foreach (var type in types.Where(t => t.IsPublic))
{
    Console.WriteLine($"公共类型: {type.Name}");
}

// 动态加载程序集
Assembly loadedAssembly = Assembly.LoadFrom("MyLibrary.dll");
Type[] loadedTypes = loadedAssembly.GetTypes();
```

### 6. ✨ 检查应用于某种类型的自定义特性

```csharp
// 获取类上的特性
Type personType = typeof(Person);
var classAttributes = personType.GetCustomAttributes();
foreach (var attr in classAttributes)
{
    Console.WriteLine($"类特性: {attr.GetType().Name}");
}

// 获取属性上的特性
PropertyInfo nameProperty = personType.GetProperty("Name");
var propertyAttributes = nameProperty.GetCustomAttributes();
foreach (var attr in propertyAttributes)
{
    Console.WriteLine($"属性特性: {attr.GetType().Name}");
}

// 检查是否有特定特性
bool hasObsoleteAttribute = personType.IsDefined(typeof(ObsoleteAttribute), false);
```

### 7. 🔧 创建和编译新程序集

```csharp
using System.Reflection.Emit;

// 创建动态程序集
AssemblyName assemblyName = new AssemblyName("DynamicAssembly");
AssemblyBuilder assemblyBuilder = AssemblyBuilder.DefineDynamicAssembly(
    assemblyName, AssemblyBuilderAccess.Run);

// 创建动态模块
ModuleBuilder moduleBuilder = assemblyBuilder.DefineDynamicModule("DynamicModule");

// 创建动态类型
TypeBuilder typeBuilder = moduleBuilder.DefineType("DynamicClass", 
    TypeAttributes.Public | TypeAttributes.Class);

// 添加属性
FieldBuilder fieldBuilder = typeBuilder.DefineField("_value", typeof(int), FieldAttributes.Private);
PropertyBuilder propertyBuilder = typeBuilder.DefineProperty("Value", PropertyAttributes.None, typeof(int), null);

// 创建类型
Type dynamicType = typeBuilder.CreateType();
object instance = Activator.CreateInstance(dynamicType);
```

## 自定义特性

### 🎨 创建自定义特性

自定义特性是继承自 `System.Attribute` 的类，用于为代码元素添加元数据。

#### 1. 基础特性定义

```csharp
// 定义一个简单的显示信息特性
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Property, AllowMultiple = false)]
public class DisplayInfoAttribute : Attribute
{
    public string DisplayName { get; set; }
    public string Description { get; set; }
    public int Order { get; set; }

    public DisplayInfoAttribute(string displayName)
    {
        DisplayName = displayName;
        Order = 0;
    }

    public DisplayInfoAttribute(string displayName, string description) : this(displayName)
    {
        Description = description;
    }
}
```

#### 2. 验证特性

```csharp
[AttributeUsage(AttributeTargets.Property)]
public class ValidationAttribute : Attribute
{
    public bool Required { get; set; }
    public int MinLength { get; set; }
    public int MaxLength { get; set; }
    public string Pattern { get; set; }
    public string ErrorMessage { get; set; }

    public ValidationAttribute()
    {
        Required = false;
        MinLength = 0;
        MaxLength = int.MaxValue;
    }
}
```

#### 3. 配置特性

```csharp
[AttributeUsage(AttributeTargets.Class)]
public class ConfigurationAttribute : Attribute
{
    public string Section { get; set; }
    public bool AutoSave { get; set; }
    
    public ConfigurationAttribute(string section)
    {
        Section = section;
        AutoSave = true;
    }
}
```

### 🎯 使用自定义特性

```csharp
[DisplayInfo("用户信息", "用户实体类")]
[Configuration("Users")]
public class User
{
    [DisplayInfo("用户ID", "唯一标识符", Order = 1)]
    [Validation(Required = true)]
    public int Id { get; set; }

    [DisplayInfo("用户名", "登录用户名", Order = 2)]
    [Validation(Required = true, MinLength = 3, MaxLength = 20, 
                Pattern = @"^[a-zA-Z0-9_]+$", ErrorMessage = "用户名格式不正确")]
    public string Username { get; set; }

    [DisplayInfo("邮箱", "用户邮箱地址", Order = 3)]
    [Validation(Required = true, Pattern = @"^[\w\.-]+@[\w\.-]+\.\w+$", 
                ErrorMessage = "邮箱格式不正确")]
    public string Email { get; set; }

    [DisplayInfo("年龄", "用户年龄", Order = 4)]
    [Validation(Required = false)]
    public int? Age { get; set; }
}
```

### 🔍 读取和处理自定义特性

```csharp
public static class AttributeProcessor
{
    // 获取类的显示信息
    public static void PrintClassInfo<T>()
    {
        Type type = typeof(T);
        
        // 获取类的 DisplayInfo 特性
        var classDisplayInfo = type.GetCustomAttribute<DisplayInfoAttribute>();
        if (classDisplayInfo != null)
        {
            Console.WriteLine($"类名: {classDisplayInfo.DisplayName}");
            Console.WriteLine($"描述: {classDisplayInfo.Description}");
        }

        // 获取配置特性
        var configAttribute = type.GetCustomAttribute<ConfigurationAttribute>();
        if (configAttribute != null)
        {
            Console.WriteLine($"配置节: {configAttribute.Section}");
            Console.WriteLine($"自动保存: {configAttribute.AutoSave}");
        }
    }

    // 获取属性信息并按顺序排序
    public static void PrintPropertyInfo<T>()
    {
        Type type = typeof(T);
        var properties = type.GetProperties()
            .Select(p => new
            {
                Property = p,
                DisplayInfo = p.GetCustomAttribute<DisplayInfoAttribute>(),
                Validation = p.GetCustomAttribute<ValidationAttribute>()
            })
            .Where(x => x.DisplayInfo != null)
            .OrderBy(x => x.DisplayInfo.Order);

        foreach (var item in properties)
        {
            Console.WriteLine($"\n属性: {item.Property.Name}");
            Console.WriteLine($"  显示名: {item.DisplayInfo.DisplayName}");
            Console.WriteLine($"  描述: {item.DisplayInfo.Description}");
            Console.WriteLine($"  顺序: {item.DisplayInfo.Order}");
            
            if (item.Validation != null)
            {
                Console.WriteLine($"  验证规则:");
                Console.WriteLine($"    必填: {item.Validation.Required}");
                if (item.Validation.MinLength > 0)
                    Console.WriteLine($"    最小长度: {item.Validation.MinLength}");
                if (item.Validation.MaxLength < int.MaxValue)
                    Console.WriteLine($"    最大长度: {item.Validation.MaxLength}");
                if (!string.IsNullOrEmpty(item.Validation.Pattern))
                    Console.WriteLine($"    正则模式: {item.Validation.Pattern}");
                if (!string.IsNullOrEmpty(item.Validation.ErrorMessage))
                    Console.WriteLine($"    错误消息: {item.Validation.ErrorMessage}");
            }
        }
    }

    // 验证对象
    public static bool ValidateObject<T>(T obj, out List<string> errors)
    {
        errors = new List<string>();
        Type type = typeof(T);
        
        foreach (var property in type.GetProperties())
        {
            var validation = property.GetCustomAttribute<ValidationAttribute>();
            var displayInfo = property.GetCustomAttribute<DisplayInfoAttribute>();
            
            if (validation != null)
            {
                var value = property.GetValue(obj);
                string displayName = displayInfo?.DisplayName ?? property.Name;
                
                // 检查必填
                if (validation.Required && (value == null || 
                    (value is string str && string.IsNullOrWhiteSpace(str))))
                {
                    errors.Add($"{displayName} 是必填项");
                    continue;
                }
                
                // 检查字符串长度和模式
                if (value is string stringValue && !string.IsNullOrEmpty(stringValue))
                {
                    if (stringValue.Length < validation.MinLength)
                        errors.Add($"{displayName} 长度不能少于 {validation.MinLength} 个字符");
                    
                    if (stringValue.Length > validation.MaxLength)
                        errors.Add($"{displayName} 长度不能超过 {validation.MaxLength} 个字符");
                    
                    if (!string.IsNullOrEmpty(validation.Pattern))
                    {
                        if (!System.Text.RegularExpressions.Regex.IsMatch(stringValue, validation.Pattern))
                        {
                            string errorMsg = !string.IsNullOrEmpty(validation.ErrorMessage) 
                                ? validation.ErrorMessage 
                                : $"{displayName} 格式不正确";
                            errors.Add(errorMsg);
                        }
                    }
                }
            }
        }
        
        return errors.Count == 0;
    }
}
```

## 实际应用示例

### 🏭 对象映射器

```csharp
public static class ObjectMapper
{
    public static TTarget MapTo<TSource, TTarget>(TSource source) 
        where TTarget : new()
    {
        var target = new TTarget();
        var sourceType = typeof(TSource);
        var targetType = typeof(TTarget);

        foreach (var sourceProperty in sourceType.GetProperties())
        {
            var targetProperty = targetType.GetProperty(sourceProperty.Name);
            if (targetProperty != null && targetProperty.CanWrite)
            {
                var value = sourceProperty.GetValue(source);
                targetProperty.SetValue(target, value);
            }
        }

        return target;
    }
}

// 使用示例
var user = new User { Id = 1, Username = "john", Email = "john@example.com" };
var userDto = ObjectMapper.MapTo<User, UserDto>(user);
```

### 🎛️ 简单的依赖注入容器

```csharp
public class SimpleContainer
{
    private readonly Dictionary<Type, object> _services = new();
    private readonly Dictionary<Type, Type> _transientTypes = new();

    public void RegisterSingleton<T>(T instance)
    {
        _services[typeof(T)] = instance;
    }

    public void RegisterTransient<TInterface, TImplementation>()
        where TImplementation : class, TInterface
    {
        _transientTypes[typeof(TInterface)] = typeof(TImplementation);
    }

    public T Resolve<T>()
    {
        var type = typeof(T);
        
        // 检查单例
        if (_services.ContainsKey(type))
            return (T)_services[type];
        
        // 检查瞬态
        if (_transientTypes.ContainsKey(type))
        {
            var implementationType = _transientTypes[type];
            return (T)CreateInstance(implementationType);
        }
        
        // 直接创建
        return (T)CreateInstance(type);
    }

    private object CreateInstance(Type type)
    {
        var constructor = type.GetConstructors().First();
        var parameters = constructor.GetParameters();
        
        if (parameters.Length == 0)
            return Activator.CreateInstance(type);
        
        var args = new object[parameters.Length];
        for (int i = 0; i < parameters.Length; i++)
        {
            args[i] = Resolve(parameters[i].ParameterType);
        }
        
        return constructor.Invoke(args);
    }

    private object Resolve(Type type)
    {
        var method = typeof(SimpleContainer).GetMethod(nameof(Resolve), Type.EmptyTypes);
        var genericMethod = method.MakeGenericMethod(type);
        return genericMethod.Invoke(this, null);
    }
}
```

### 📊 配置解析器

```csharp
public class ConfigurationParser
{
    public static T ParseConfiguration<T>(Dictionary<string, string> config) where T : new()
    {
        var instance = new T();
        var type = typeof(T);
        
        var configAttribute = type.GetCustomAttribute<ConfigurationAttribute>();
        string prefix = configAttribute?.Section ?? type.Name;
        
        foreach (var property in type.GetProperties().Where(p => p.CanWrite))
        {
            string key = $"{prefix}:{property.Name}";
            if (config.TryGetValue(key, out string value))
            {
                var convertedValue = Convert.ChangeType(value, property.PropertyType);
                property.SetValue(instance, convertedValue);
            }
        }
        
        return instance;
    }
}
```

## 性能考虑

### ⚡ 优化建议

1. **缓存反射结果**: 反射操作相对昂贵，应该缓存 `Type`、`PropertyInfo`、`MethodInfo` 等对象
2. **使用表达式树**: 对于频繁调用的场景，考虑使用表达式树编译委托
3. **避免过度使用**: 在性能敏感的路径中谨慎使用反射

```csharp
// 缓存示例
public static class ReflectionCache
{
    private static readonly ConcurrentDictionary<string, PropertyInfo> PropertyCache = new();
    
    public static PropertyInfo GetProperty(Type type, string propertyName)
    {
        string key = $"{type.FullName}.{propertyName}";
        return PropertyCache.GetOrAdd(key, _ => type.GetProperty(propertyName));
    }
}

// 表达式树示例
public static class FastPropertyAccessor
{
    public static Func<T, TProperty> CreateGetter<T, TProperty>(string propertyName)
    {
        var parameter = Expression.Parameter(typeof(T), "instance");
        var property = Expression.Property(parameter, propertyName);
        var lambda = Expression.Lambda<Func<T, TProperty>>(property, parameter);
        return lambda.Compile();
    }
}
```

---

## 总结

反射和自定义特性是 C# 中非常强大的功能，它们为我们提供了在运行时操作类型和对象的能力。通过合理使用这些功能，我们可以构建灵活、可扩展的应用程序。但同时也要注意性能影响，在必要时进行优化。

🔗 **相关主题**: 表达式树、动态编程、元编程、依赖注入、序列化
