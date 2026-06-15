package com.oficina_dev.backend.configs;

import com.oficina_dev.backend.models.Address.Address;
import com.oficina_dev.backend.models.Category.Category;
import com.oficina_dev.backend.models.Giver.Giver;
import com.oficina_dev.backend.models.Item.Item;
import com.oficina_dev.backend.models.Person.Person;
import com.oficina_dev.backend.models.Size.Size;
import com.oficina_dev.backend.models.Voluntary.Voluntary;
import com.oficina_dev.backend.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.lang.reflect.Field;
import java.util.List;
import java.util.UUID;

@Configuration
@Profile("test")
public class TestConfig implements CommandLineRunner {
    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private SizeRepository sizeRepository;

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private VoluntaryRepository voluntaryRepository;

    @Autowired
    private GiverRepository giverRepository;

    // UUIDs fixos para Address
    private final UUID ADDRESS_1_ID = UUID.fromString("11111111-1111-1111-1111-111111111111");
    private final UUID ADDRESS_2_ID = UUID.fromString("11111111-1111-1111-1111-111111111112");
    private final UUID ADDRESS_3_ID = UUID.fromString("11111111-1111-1111-1111-111111111113");

    // UUIDs fixos para Person
    private final UUID PERSON_1_ID = UUID.fromString("22222222-2222-2222-2222-222222222221");
    private final UUID PERSON_2_ID = UUID.fromString("22222222-2222-2222-2222-222222222222");
    private final UUID PERSON_3_ID = UUID.fromString("22222222-2222-2222-2222-222222222223");

    // UUIDs fixos para Size
    private final UUID SIZE_P_ID = UUID.fromString("33333333-3333-3333-3333-333333333331");
    private final UUID SIZE_M_ID = UUID.fromString("33333333-3333-3333-3333-333333333332");
    private final UUID SIZE_G_ID = UUID.fromString("33333333-3333-3333-3333-333333333333");
    private final UUID SIZE_GG_ID = UUID.fromString("33333333-3333-3333-3333-333333333334");

    // UUIDs fixos para Category
    private final UUID CATEGORY_1_ID = UUID.fromString("44444444-4444-4444-4444-444444444441");
    private final UUID CATEGORY_2_ID = UUID.fromString("44444444-4444-4444-4444-444444444442");
    private final UUID CATEGORY_3_ID = UUID.fromString("44444444-4444-4444-4444-444444444443");
    private final UUID CATEGORY_4_ID = UUID.fromString("44444444-4444-4444-4444-444444444444");
    private final UUID CATEGORY_5_ID = UUID.fromString("44444444-4444-4444-4444-444444444445");

    // UUIDs fixos para Item
    private final UUID ITEM_1_ID = UUID.fromString("55555555-5555-5555-5555-555555555551");
    private final UUID ITEM_2_ID = UUID.fromString("55555555-5555-5555-5555-555555555552");
    private final UUID ITEM_3_ID = UUID.fromString("55555555-5555-5555-5555-555555555553");

    // UUIDs fixos para Voluntary
    private final UUID VOLUNTARY_1_ID = UUID.fromString("66666666-6666-6666-6666-666666666661");
    private final UUID VOLUNTARY_2_ID = UUID.fromString("66666666-6666-6666-6666-666666666662");
    private final UUID VOLUNTARY_3_ID = UUID.fromString("66666666-6666-6666-6666-666666666663");

    // UUIDs fixos para Giver
    private final UUID GIVER_1_ID = UUID.fromString("77777777-7777-7777-7777-777777777771");
    private final UUID GIVER_2_ID = UUID.fromString("77777777-7777-7777-7777-777777777772");
    private final UUID GIVER_3_ID = UUID.fromString("77777777-7777-7777-7777-777777777773");

    @Override
    public void run(String... args) throws Exception {
        // Endereços com IDs fixos
        Address address1 = new Address(4232, "Avenida Brasil", "Independência", null, "Perto do Enjoy");
        Address address2 = new Address(1234, "Rua das Flores", "Centro", "Perto escola", "Próximo ao Parque Ibirapuera");
        Address address3 = new Address(5678, "Avenida Paulista", "Bela Vista", "São Paulo", "Em frente ao MASP");
        List<Address> addresses = this.addressRepository.saveAllAndFlush(List.of(address1, address2, address3));

        Person person1 = new Person("Zé", "45998269093", "10070080090", "zebonito@gmail.com", addresses.get(0));
        Person person2 = new Person("Maria", "45998269094", "10070080091", "maria123@gmail.com", addresses.get(1));
        Person person3 = new Person("João", "45998269095", "10070080092", "joao@gmail.com", addresses.get(2));
        List<Person> people = personRepository.saveAllAndFlush(List.of(person1, person2, person3));

        // Tamanhos com IDs fixos
        Size sizeP = new Size("P");
        Size sizeM = new Size("M");
        Size sizeG = new Size("G");
        Size sizeGG = new Size("GG");
        List<Size> sizes = sizeRepository.saveAllAndFlush(List.of(sizeP, sizeM, sizeG, sizeGG));

        // Categorias com IDs fixos
        Category category1 = new Category("Camiseta");
        Category category2 = new Category("Calça");
        Category category3 = new Category("Tênis");
        Category category4 = new Category("Bermuda");
        Category category5 = new Category("Camisa");

        List<Category> categories = categoryRepository.saveAllAndFlush(
                List.of(category1, category2, category3, category4, category5));

        // Itens com IDs fixos
        Item item1 = new Item("Camiseta Bonita", 10, 'm', categories.get(0), sizes.get(1));
        Item item2 = new Item("Calça Jeans", 20, 'f', categories.get(1), sizes.get(2));
        Item item3 = new Item("Tênis Esportivo", 10, 'm', categories.get(2), sizes.get(3));
        itemRepository.saveAllAndFlush(List.of(item1, item2, item3));

        // Voluntários com IDs fixos
        Voluntary voluntary1 = new Voluntary(people.get(0), "admin123", Boolean.TRUE);
        Voluntary voluntary2 = new Voluntary(people.get(1), "admin456", Boolean.FALSE);
        Voluntary voluntary3 = new Voluntary(people.get(2), "admin789", Boolean.TRUE);
        voluntaryRepository.saveAllAndFlush(List.of(voluntary1, voluntary2, voluntary3));

        // Doadores com IDs fixos
        Giver giver1 = new Giver(people.get(0));
        Giver giver2 = new Giver(people.get(1));
        Giver giver3 = new Giver(people.get(2));

        List<Giver> givers = giverRepository.saveAllAndFlush(List.of(giver1, giver2, giver3));
    }
}
