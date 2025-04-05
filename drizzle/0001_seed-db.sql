-- Custom SQL migration file, put your code below! --
INSERT INTO public.users ("name",email) VALUES
	 ('John Doe','john@example.com'),
	 ('Skibidi Toilet','SIGMA@gmail.com');

INSERT INTO public.posts (id_user,title,"comment") VALUES
	 (1,'LOS LOLOS','NOS CAGASTE EL PROYECTO');