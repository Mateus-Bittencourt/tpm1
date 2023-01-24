import express from "express";
import { promises as fs } from "fs";

const { readFile } = fs;

const router = express.Router();

router.get("/moreModels", async (req, res, next) => {
  try {
    const brandList = JSON.parse(await readFile("car-list.json"));

    const brandWithMoreModels = brandList.reduce((prev, current) =>
      prev.models.length > current.models.length ? prev : current
    );
    const brandsWithMoreModels = brandList.filter(
      (brand) => brand.models.length === brandWithMoreModels.models.length
    );

    res.send(
      brandsWithMoreModels.length === 1
        ? { brand: brandsWithMoreModels[0].brand }
        : { brands: brandsWithMoreModels.brand }
    );
  } catch (error) {
    next(error);
  }
});

router.get("/fewerModels", async (req, res, next) => {
  try {
    const brandList = JSON.parse(await readFile("car-list.json"));

    const brandWithFewerModels = brandList.reduce((prev, current) =>
      prev.models.length < current.models.length ? prev : current
    );

    const brandsWithFewerModels = brandList.filter(
      (brand) => brand.models.length === brandWithFewerModels.models.length
    );

    res.send(
      brandsWithFewerModels.length === 1
        ? { brand: brandsWithFewerModels[0].brand }
        : { brands: brandsWithFewerModels.brand }
    );
  } catch (error) {
    next(error);
  }
});

router.get("/listMoreModels/:x", async (req, res, next) => {
  try {
    const brandList = JSON.parse(await readFile("car-list.json"));

    brandList.sort((a, b) => {
      if (a.models.length > b.models.length) {
        return -1;
      }
      if (a.models.length < b.models.length) {
        return 1;
      }
      if (a.brand < b.brand) {
        return -1;
      } else {
        return 1;
      }
    });

    brandList.forEach((element) => {
      element.modelCount = element.models.length;
      delete element.models;
    });

    res.send(brandList.slice(0, req.params.x));
  } catch (error) {
    next(error);
  }
});

router.get("/listFewerModels/:x", async (req, res, next) => {
  try {
    const brandList = JSON.parse(await readFile("car-list.json"));

    brandList.sort((a, b) => {
      if (a.models.length < b.models.length) {
        return -1;
      }
      if (a.models.length > b.models.length) {
        return 1;
      }
      if (a.brand < b.brand) {
        return -1;
      } else {
        return 1;
      }
    });

    brandList.forEach((element) => {
      element.modelCount = element.models.length;
      delete element.models;
    });

    res.send(brandList.slice(0, req.params.x));
  } catch (error) {
    next(error);
  }
});

router.post("/listModels", async (req, res, next) => {
  try {
    const brandList = JSON.parse(await readFile("car-list.json"));

    const brand = brandList.find(
      (brand) => brand.brand.toLowerCase() === req.body.brand.toLowerCase()
    );

    if (!brand) {
      throw new Error("Brand not found");
    }

    res.send(brand.models);
  } catch (error) {
    next(error);
  }
});

router.use((err, req, res, next) => {
  console.log(err);
  res.status(400).send({ error: err.message });
});

export default router;
