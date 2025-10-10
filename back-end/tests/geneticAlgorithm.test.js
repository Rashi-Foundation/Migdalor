// tests/geneticAlgorithm.test.js
const {
  generateInitialPopulation,
  calculateFitness,
  selectParents,
  crossover,
  mutate,
  geneticAlgorithm,
  getTopEmployeesForStation,
  getAllSortedEmployeesForStation,
} = require("../geneticAlgorithm");

describe("Genetic Algorithm Functions", () => {
  const employees = [
    { person_id: "E1" },
    { person_id: "E2" },
    { person_id: "E3" },
  ];
  const stations = [
    { station_id: "S1", station_name: "Station1" },
    { station_id: "S2", station_name: "Station2" },
  ];
  const qualifications = [
    { person_id: "E1", station_name: "Station1", avg: 80 },
    { person_id: "E2", station_name: "Station2", avg: 90 },
    { person_id: "E3", station_name: "Station1", avg: 70 },
  ];

  describe("generateInitialPopulation", () => {
    it("creates population of correct size and assignments", () => {
      const population = generateInitialPopulation(employees, stations, 5);
      expect(population).toHaveLength(5);
      population.forEach((assignment) => {
        expect(Object.keys(assignment)).toEqual(["S1", "S2"]);
        Object.values(assignment).forEach((id) => {
          expect(employees.map((e) => e.person_id)).toContain(id);
        });
      });
    });
  });

  describe("calculateFitness", () => {
    it("calculates fitness correctly based on qualifications", () => {
      const assignment = { S1: "E1", S2: "E2" };
      const fitness = calculateFitness(
        assignment,
        employees,
        stations,
        qualifications
      );
      expect(fitness).toBe(80 + 90);
    });

    it("returns 0 if no matching qualifications", () => {
      const assignment = { S1: "E2", S2: "E3" }; // mismatch
      const fitness = calculateFitness(
        assignment,
        employees,
        stations,
        qualifications
      );
      expect(fitness).toBe(0);
    });
  });

  describe("selectParents", () => {
    it("selects parent with higher probability for higher fitness", () => {
      const population = [{ a: 1 }, { b: 2 }];
      const fitnesses = [0, 100]; // second has high fitness
      // Mock Math.random to always choose mid-range
      jest.spyOn(Math, "random").mockReturnValue(0.5);
      const parent = selectParents(population, fitnesses);
      expect(parent).toEqual(population[1]);
      Math.random.mockRestore();
    });

    it("selects randomly if total fitness is 0", () => {
      const population = [{ a: 1 }, { b: 2 }];
      const fitnesses = [0, 0];
      jest.spyOn(Math, "random").mockReturnValue(0.7);
      const parent = selectParents(population, fitnesses);
      expect(population).toContain(parent);
      Math.random.mockRestore();
    });
  });

  describe("crossover", () => {
    it("combines genes from two parents", () => {
      const parent1 = { S1: "E1", S2: "E2" };
      const parent2 = { S1: "E3", S2: "E2" };
      jest.spyOn(Math, "random").mockReturnValue(0.4); // first parent for all
      const child = crossover(parent1, parent2);
      expect(child).toEqual(parent1);
      Math.random.mockRestore();
    });
  });

  describe("mutate", () => {
    it("mutates assignment based on mutation rate", () => {
      const assignment = { S1: "E1", S2: "E2" };

      // Force mutation for both stations
      jest.spyOn(Math, "random").mockReturnValue(0.01);

      const mutated = mutate(assignment, employees, 0.05);

      // Ensure mutation occurred and values are valid employee IDs
      Object.values(mutated).forEach((id) => {
        expect(employees.map((e) => e.person_id)).toContain(id);
      });

      // Optionally check at least one station changed
      expect(Object.values(mutated)).not.toEqual(Object.values(assignment));

      Math.random.mockRestore();
    });
  });

  describe("geneticAlgorithm", () => {
    it("returns assignment with max fitness", () => {
      const best = geneticAlgorithm(
        employees,
        stations,
        qualifications,
        10,
        5,
        0
      );
      const fitness = calculateFitness(
        best,
        employees,
        stations,
        qualifications
      );
      expect(fitness).toBeGreaterThan(0);
    });
  });

  describe("getTopEmployeesForStation", () => {
    it("returns top N employees for a station", () => {
      const top = getTopEmployeesForStation(
        employees,
        stations[0],
        qualifications,
        2
      );
      expect(top[0].person_id).toBe("E1"); // highest avg
      expect(top).toHaveLength(2);
    });
  });

  describe("getAllSortedEmployeesForStation", () => {
    it("returns all qualified employees sorted by avg desc", () => {
      const sorted = getAllSortedEmployeesForStation(
        employees,
        stations[0],
        qualifications
      );
      expect(sorted[0].person_id).toBe("E1");
      expect(sorted.every((e) => e.qualification > 0)).toBe(true);
    });
  });
});
