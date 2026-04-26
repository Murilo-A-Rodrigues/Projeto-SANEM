
CREATE TABLE public.tb_address (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    number INTEGER NOT NULL,
    street VARCHAR(100) NOT NULL,
    neighborhood VARCHAR(100) NOT NULL,
    complement VARCHAR(100),
    reference_point VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ
);

CREATE TABLE public.tb_people (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    cpf VARCHAR(20),
    email VARCHAR(320),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ,
    id_address UUID UNIQUE,
    CONSTRAINT fk_people_address FOREIGN KEY (id_address) REFERENCES public.tb_address(id)
);

CREATE TABLE public.tb_givers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ,
    id_person UUID UNIQUE,
    CONSTRAINT fk_giver_person FOREIGN KEY (id_person) REFERENCES public.tb_people(id)
);

CREATE TABLE public.tb_voluntaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    password VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ,
    id_person UUID UNIQUE,
    CONSTRAINT fk_voluntary_person FOREIGN KEY (id_person) REFERENCES public.tb_people(id)
);

CREATE TABLE public.tb_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    update_at TIMESTAMPTZ
);

CREATE TABLE public.tb_sizes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ
);

CREATE TABLE public.tb_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    sex CHAR(1) NOT NULL,
    quantity INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ,
    id_category UUID NOT NULL,
    id_size UUID NOT NULL,
    CONSTRAINT fk_item_category FOREIGN KEY (id_category) REFERENCES public.tb_categories(id),
    CONSTRAINT fk_item_size FOREIGN KEY (id_size) REFERENCES public.tb_sizes(id)
);

CREATE TABLE public.tb_donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ,
    id_giver UUID,
    id_voluntary UUID,
    CONSTRAINT fk_donation_giver FOREIGN KEY (id_giver) REFERENCES public.tb_givers(id),
    CONSTRAINT fk_donation_voluntary FOREIGN KEY (id_voluntary) REFERENCES public.tb_voluntaries(id)
);

CREATE TABLE public.tb_donation_items (
    id_donation UUID NOT NULL,
    id_item UUID NOT NULL,
    quantity INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ,
    PRIMARY KEY (id_donation, id_item),
    CONSTRAINT fk_donationitem_donation FOREIGN KEY (id_donation) REFERENCES public.tb_donations(id),
    CONSTRAINT fk_donationitem_item FOREIGN KEY (id_item) REFERENCES public.tb_items(id)
);

CREATE TABLE public.tb_receivers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nif VARCHAR(100) NOT NULL UNIQUE,
    is_fit BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ,
    id_person UUID UNIQUE,
    CONSTRAINT fk_receiver_person FOREIGN KEY (id_person) REFERENCES public.tb_people(id)
);

CREATE TABLE public.tb_limits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    value INTEGER NOT NULL
);

CREATE TABLE public.tb_receiver_limit (
    id_receiver UUID NOT NULL,
    id_limit UUID NOT NULL,
    caught_items INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ,
    PRIMARY KEY (id_receiver, id_limit),
    CONSTRAINT fk_receiverlimit_receiver FOREIGN KEY (id_receiver) REFERENCES public.tb_receivers(id),
    CONSTRAINT fk_receiverlimit_limit FOREIGN KEY (id_limit) REFERENCES public.tb_limits(id)
);

CREATE TABLE public.tb_transfers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ,
    id_receiver UUID,
    id_voluntary UUID,
    CONSTRAINT fk_transfer_receiver FOREIGN KEY (id_receiver) REFERENCES public.tb_receivers(id),
    CONSTRAINT fk_transfer_voluntary FOREIGN KEY (id_voluntary) REFERENCES public.tb_voluntaries(id)
);

CREATE TABLE public.tb_transfer_donation_items (
    id_transfer_donation UUID NOT NULL,
    id_item UUID NOT NULL,
    quantity INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ,
    PRIMARY KEY (id_transfer_donation, id_item),
    CONSTRAINT fk_transferdonationitem_transfer FOREIGN KEY (id_transfer_donation) REFERENCES public.tb_transfers(id),
    CONSTRAINT fk_transferdonationitem_item FOREIGN KEY (id_item) REFERENCES public.tb_items(id)
);

