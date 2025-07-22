-- Add slug column as nullable first
ALTER TABLE products ADD COLUMN IF NOT EXISTS slug VARCHAR(255) NULL;

-- Create a temporary procedure to generate slugs
DELIMITER $$
CREATE PROCEDURE GenerateProductSlugs()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE product_id VARCHAR(36);
    DECLARE product_name VARCHAR(255);
    DECLARE product_slug VARCHAR(255);
    DECLARE slug_counter INT;
    
    DECLARE cur CURSOR FOR SELECT id, name FROM products WHERE slug IS NULL;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN cur;
    
    read_loop: LOOP
        FETCH cur INTO product_id, product_name;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- Generate base slug
        SET product_slug = LOWER(product_name);
        SET product_slug = REPLACE(product_slug, ' ', '-');
        SET product_slug = REPLACE(product_slug, '&', '-and-');
        SET product_slug = REPLACE(product_slug, '+', '-plus-');
        SET product_slug, = REPLACE(product_slug, '"', '');
        SET product_slug = REPLACE(product_slug, '''', '');
        SET product_slug = REPLACE(product_slug, '.', '-');
        SET product_slug = REPLACE(product_slug, ',', '');
        SET product_slug = REPLACE(product_slug, '(', '');
        SET product_slug = REPLACE(product_slug, ')', '');
        SET product_slug = REPLACE(product_slug, '[', '');
        SET product_slug = REPLACE(product_slug, ']', '');
        SET product_slug = REPLACE(product_slug, '/', '-');
        SET product_slug = REPLACE(product_slug, '--', '-');
        SET product_slug = TRIM(BOTH '-' FROM product_slug);
        
        -- Check for duplicates and make unique
        SET slug_counter = 0;
        WHILE EXISTS (SELECT 1 FROM products WHERE slug = product_slug AND id != product_id) DO
            SET slug_counter = slug_counter + 1;
            SET product_slug = CONCAT(LOWER(REPLACE(product_name, ' ', '-')), '-', slug_counter);
        END WHILE;
        
        -- Update the product with its slug
        UPDATE products SET slug = product_slug WHERE id = product_id;
    END LOOP;
    
    CLOSE cur;
END$$
DELIMITER ;

-- Call the procedure
CALL GenerateProductSlugs();

-- Drop the temporary procedure
DROP PROCEDURE GenerateProductSlugs;

-- Add index on slug
CREATE INDEX idx_products_slug ON products(slug);

-- Add unique constraint
ALTER TABLE products ADD CONSTRAINT unique_product_slug UNIQUE (slug);

-- Make slug NOT NULL
ALTER TABLE products MODIFY COLUMN slug VARCHAR(255) NOT NULL;